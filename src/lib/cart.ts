"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── helpers ────────────────────────────────────────────────────────────────

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

// ─── public actions ──────────────────────────────────────────────────────────

/** Add or increment an item. Redirects to /login if not authenticated. */
export async function addToCart(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?redirectTo=/cart");
  }

  const cart = await getOrCreateCart(session.user.id);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: 1 },
    });
  }

  revalidatePath("/cart");
}

/** Update quantity. quantity === 0 removes the item. */
export async function updateCartItem(cartItemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
}

/** Remove a single cart item. */
export async function removeCartItem(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath("/cart");
}

/** Fetch full cart with product info for the current session user. */
export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          product: {
            include: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
    },
  });
}

/** Count total items in cart (for badge). Returns 0 if not logged in. */
export async function getCartCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: { _count: { select: { items: true } } },
  });

  return cart?._count.items ?? 0;
}
