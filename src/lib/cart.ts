import "server-only";

import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

const cartItemSelect = {
  id: true,
  quantity: true,
  product: {
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      stock: true,
      status: true,
      images: {
        orderBy: { position: "asc" } as const,
        take: 1,
        select: { url: true, alt: true },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

type RawCartItem = Prisma.CartItemGetPayload<{ select: typeof cartItemSelect }>;

export type CartLine = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: {
    id: string;
    slug: string;
    name: string;
    stock: number;
    status: ProductStatus;
    primaryImageUrl: string | null;
    primaryImageAlt: string | null;
  };
};

export type CartView = {
  id: string;
  items: CartLine[];
  subtotal: number;
  itemCount: number;
};

function toCartLine(item: RawCartItem): CartLine {
  const unitPrice = Number(item.product.price);
  return {
    id: item.id,
    quantity: item.quantity,
    unitPrice,
    lineTotal: unitPrice * item.quantity,
    product: {
      id: item.product.id,
      slug: item.product.slug,
      name: item.product.name,
      stock: item.product.stock,
      status: item.product.status,
      primaryImageUrl: item.product.images[0]?.url ?? null,
      primaryImageAlt: item.product.images[0]?.alt ?? null,
    },
  };
}

export async function getOrCreateCart(userId: string): Promise<{ id: string }> {
  const existing = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (existing) return existing;
  return prisma.cart.create({
    data: { userId },
    select: { id: true },
  });
}

export async function getCartViewByUser(
  userId: string,
): Promise<CartView | null> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: {
      id: true,
      items: {
        orderBy: { createdAt: "asc" },
        select: cartItemSelect,
      },
    },
  });
  if (!cart) return null;
  const lines = cart.items.map(toCartLine);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { id: cart.id, items: lines, subtotal, itemCount };
}

export async function getCartCount(userId: string): Promise<number> {
  const rows = await prisma.cartItem.findMany({
    where: { cart: { userId } },
    select: { quantity: true },
  });
  return rows.reduce((sum, r) => sum + r.quantity, 0);
}
