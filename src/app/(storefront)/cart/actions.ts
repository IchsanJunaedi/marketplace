"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ProductStatus } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getOrCreateCart } from "@/lib/cart";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect("/auth/signin?next=/cart");
  }
  return userId;
}

const productIdSchema = z.string().min(1);
const quantitySchema = z.coerce.number().int().min(1).max(999);
const deltaSchema = z.coerce.number().int().min(-999).max(999);
const itemIdSchema = z.string().min(1);

/**
 * Add a product to the user's cart. Increments quantity if a line for the same
 * product already exists. Always clamps to product.stock so we never persist
 * an oversold cart.
 */
export async function addToCartAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const productId = productIdSchema.parse(formData.get("productId"));
  const quantity = quantitySchema.parse(formData.get("quantity") ?? 1);
  const redirectTo = String(formData.get("redirectTo") ?? "/cart");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, status: true },
  });
  if (!product || product.status !== ProductStatus.ACTIVE) {
    throw new Error("Produk tidak tersedia.");
  }
  if (product.stock < 1) {
    throw new Error("Produk habis.");
  }

  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    select: { id: true, quantity: true },
  });

  const desired = (existing?.quantity ?? 0) + quantity;
  const finalQty = Math.min(desired, product.stock);

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: finalQty },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: finalQty },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  redirect(redirectTo);
}

/**
 * Adjust an existing cart line by a delta (+1 / -1 from the cart UI). If the
 * resulting quantity drops to 0 (or below) the line is removed entirely.
 * Quantity is clamped to current product.stock on the way up.
 */
export async function adjustCartItemAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const itemId = itemIdSchema.parse(formData.get("itemId"));
  const delta = deltaSchema.parse(formData.get("delta"));

  const item = await prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    select: {
      id: true,
      quantity: true,
      product: { select: { stock: true } },
    },
  });
  if (!item) return;

  const next = item.quantity + delta;
  if (next <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    const clamped = Math.min(next, item.product.stock);
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: clamped },
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const itemId = itemIdSchema.parse(formData.get("itemId"));

  await prisma.cartItem.deleteMany({
    where: { id: itemId, cart: { userId } },
  });

  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function clearCartAction(): Promise<void> {
  const userId = await requireUserId();
  await prisma.cartItem.deleteMany({ where: { cart: { userId } } });
  revalidatePath("/cart");
  revalidatePath("/checkout");
}
