"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect("/auth/signin?next=/checkout");
  }
  return userId;
}

const checkoutSchema = z.object({
  recipientFirstName: z.string().min(1).max(100),
  recipientLastName: z.string().min(1).max(100),
  street: z.string().min(3).max(500),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(3).max(20),
  phone: z.string().min(5).max(40).optional().or(z.literal("")),
  province: z.string().min(1).max(100).optional().or(z.literal("")),
  shippingService: z.enum(["JNE_REG", "JNE_YES"]).default("JNE_REG"),
});

export type CheckoutFormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof checkoutSchema>, string[]>>;
};

const SHIPPING_RATES: Record<"JNE_REG" | "JNE_YES", number> = {
  JNE_REG: 15,
  JNE_YES: 25,
};

const TAX_RATE = 0.08;

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${yyyy}${mm}${dd}-${rand}`;
}

/**
 * Create an order from the user's current cart. Runs in a single transaction
 * so a half-written order can never leak — if any step fails (no items, stock
 * underflow, etc.) the entire write rolls back and the cart stays intact.
 */
export async function placeOrderAction(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const userId = await requireUserId();
  const parsed = checkoutSchema.safeParse({
    recipientFirstName: formData.get("recipientFirstName") ?? "",
    recipientLastName: formData.get("recipientLastName") ?? "",
    street: formData.get("street") ?? "",
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    phone: formData.get("phone") ?? "",
    province: formData.get("province") ?? "",
    shippingService: formData.get("shippingService") ?? "JNE_REG",
  });
  if (!parsed.success) {
    return {
      error: "Periksa kembali data alamat pengiriman.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;
  const shippingCost = SHIPPING_RATES[data.shippingService];

  let createdOrderNumber: string | null = null;
  try {
    createdOrderNumber = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          items: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      // Validate every line against current product state. We refuse to place
      // an order if any item is unavailable / out of stock — surface a clear
      // error to the customer rather than silently dropping items.
      for (const item of cart.items) {
        if (item.product.status !== ProductStatus.ACTIVE) {
          throw new Error(`PRODUCT_UNAVAILABLE:${item.product.name}`);
        }
        if (item.product.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
        }
      }

      const subtotalDec = cart.items.reduce(
        (sum, item) => sum.plus(new Prisma.Decimal(item.product.price).mul(item.quantity)),
        new Prisma.Decimal(0),
      );
      const taxDec = subtotalDec.mul(TAX_RATE).toDecimalPlaces(2);
      const shippingDec = new Prisma.Decimal(shippingCost);
      const totalDec = subtotalDec.plus(shippingDec).plus(taxDec);

      const address = await tx.address.create({
        data: {
          userId,
          recipient: `${data.recipientFirstName} ${data.recipientLastName}`.trim(),
          phone: data.phone || "",
          province: data.province || data.city,
          city: data.city,
          postalCode: data.postalCode,
          street: data.street,
        },
        select: { id: true },
      });

      const orderNumber = generateOrderNumber();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          status: OrderStatus.PENDING_PAYMENT,
          subtotal: subtotalDec,
          shippingCost: shippingDec,
          discount: new Prisma.Decimal(0),
          total: totalDec,
          shippingCourier: "JNE",
          shippingService: data.shippingService === "JNE_YES" ? "YES" : "REG",
          expiresAt,
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              unitPrice: item.product.price,
              quantity: item.quantity,
            })),
          },
          payment: {
            create: {
              provider: "manual",
              amount: totalDec,
              status: PaymentStatus.PENDING,
              expiresAt,
            },
          },
        },
        select: { id: true, orderNumber: true },
      });

      // Decrement stock atomically per line so concurrent checkouts can't
      // oversell. We've already validated stock above so a negative update
      // here implies a race — Prisma will throw and the tx rolls back.
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Empty the cart now that the order is committed.
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order.orderNumber;
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "CART_EMPTY") {
        return { error: "Keranjang kosong. Tambah produk dulu sebelum checkout." };
      }
      if (err.message.startsWith("PRODUCT_UNAVAILABLE:")) {
        const name = err.message.split(":").slice(1).join(":");
        return { error: `Produk tidak tersedia: ${name}. Hapus dari keranjang.` };
      }
      if (err.message.startsWith("INSUFFICIENT_STOCK:")) {
        const name = err.message.split(":").slice(1).join(":");
        return { error: `Stok tidak mencukupi: ${name}. Sesuaikan jumlah.` };
      }
    }
    throw err;
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account");
  revalidatePath("/admin/orders");
  redirect(`/account?placed=${createdOrderNumber}`);
}
