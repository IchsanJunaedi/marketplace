import "server-only";

import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  stock: number;
  status: ProductStatus;
  category: { id: string; slug: string; name: string } | null;
  primaryImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean;
};

const NEW_THRESHOLD_MS = 14 * 24 * 60 * 60 * 1000;

const productSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  price: true,
  compareAt: true,
  stock: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, slug: true, name: true } },
  images: {
    orderBy: { position: "asc" } as const,
    take: 1,
    select: { url: true },
  },
} satisfies Prisma.ProductSelect;

function toListItem(
  p: Prisma.ProductGetPayload<{ select: typeof productSelect }>,
  now: number,
): ProductListItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    compareAt: p.compareAt == null ? null : Number(p.compareAt),
    stock: p.stock,
    status: p.status,
    category: p.category,
    primaryImageUrl: p.images[0]?.url ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    isNew: now - p.createdAt.getTime() < NEW_THRESHOLD_MS,
  };
}

export async function listAdminProducts(): Promise<ProductListItem[]> {
  const rows = await prisma.product.findMany({
    select: productSelect,
    orderBy: { updatedAt: "desc" },
  });
  const now = Date.now();
  return rows.map((r) => toListItem(r, now));
}

export async function listStorefrontProducts(opts?: {
  categorySlug?: string;
}): Promise<ProductListItem[]> {
  const rows = await prisma.product.findMany({
    select: productSelect,
    where: {
      status: ProductStatus.ACTIVE,
      ...(opts?.categorySlug
        ? { category: { slug: opts.categorySlug } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  const now = Date.now();
  return rows.map((r) => toListItem(r, now));
}

export type ProductDetail = ProductListItem & {
  images: { id: string; url: string; alt: string | null }[];
  weightGram: number;
};

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      weightGram: true,
      images: {
        orderBy: { position: "asc" } as const,
        select: { id: true, url: true, alt: true },
      },
    },
  });
  if (!p) return null;
  return {
    ...toListItem(
      { ...p, images: p.images.map(({ url }) => ({ url })) },
      Date.now(),
    ),
    weightGram: p.weightGram,
    images: p.images,
  };
}

export async function getProductById(
  id: string,
): Promise<ProductDetail | null> {
  const p = await prisma.product.findUnique({
    where: { id },
    select: {
      ...productSelect,
      weightGram: true,
      images: {
        orderBy: { position: "asc" } as const,
        select: { id: true, url: true, alt: true },
      },
    },
  });
  if (!p) return null;
  return {
    ...toListItem(
      { ...p, images: p.images.map(({ url }) => ({ url })) },
      Date.now(),
    ),
    weightGram: p.weightGram,
    images: p.images,
  };
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true },
  });
}
