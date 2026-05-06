import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getCart } from "@/lib/cart";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "EnterpriseStore - Checkout",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?redirectTo=/checkout");
  }

  const [cart, user] = await Promise.all([
    getCart(),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: { orderBy: { isDefault: "desc" } },
      },
    }),
  ]);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const cartItems = cart.items.map((item) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    price: Number(item.product.price),
    quantity: item.quantity,
    imageUrl: item.product.images[0]?.url ?? null,
    weightGram: item.product.weightGram,
  }));

  const addresses = (user?.addresses ?? []).map((a) => ({
    id: a.id,
    recipient: a.recipient,
    phone: a.phone,
    street: a.street,
    district: a.district ?? "",
    city: a.city,
    province: a.province,
    postalCode: a.postalCode,
    isDefault: a.isDefault,
  }));

  return (
    <CheckoutClient
      cartItems={cartItems}
      subtotal={subtotal}
      addresses={addresses}
      userEmail={user?.email ?? ""}
      userName={user?.name ?? ""}
      userPhone={user?.phone ?? ""}
      midtransClientKey={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""}
    />
  );
}
