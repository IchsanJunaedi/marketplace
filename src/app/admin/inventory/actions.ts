"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma, ProductStatus } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: "CUSTOMER" | "ADMIN" } | undefined)
    ?.role;
  if (role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -")
    .optional()
    .or(z.literal("")),
  description: z.string().max(5000).optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  price: z.coerce.number().nonnegative().max(100_000_000),
  compareAt: z.coerce
    .number()
    .nonnegative()
    .max(100_000_000)
    .optional()
    .or(z.literal("")),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  weightGram: z.coerce.number().int().nonnegative().max(1_000_000).default(0),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  primaryImageUrl: z.string().url().optional().or(z.literal("")),
});

export type ProductFormState = {
  error?: string;
  fieldErrors?: Partial<
    Record<keyof z.infer<typeof productSchema>, string[]>
  >;
};

function parseForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || "",
    description: formData.get("description") || "",
    categoryId: formData.get("categoryId") || "",
    price: formData.get("price"),
    compareAt: formData.get("compareAt") || "",
    stock: formData.get("stock"),
    weightGram: formData.get("weightGram") || 0,
    status: formData.get("status") || ProductStatus.DRAFT,
    primaryImageUrl: formData.get("primaryImageUrl") || "",
  });
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Periksa kembali data isian.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  let createdId: string;
  try {
    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        categoryId: data.categoryId || null,
        price: new Prisma.Decimal(data.price),
        compareAt:
          data.compareAt === "" || data.compareAt == null
            ? null
            : new Prisma.Decimal(data.compareAt),
        stock: data.stock,
        weightGram: data.weightGram,
        status: data.status,
        ...(data.primaryImageUrl
          ? {
              images: {
                create: { url: data.primaryImageUrl, position: 0 },
              },
            }
          : {}),
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "Slug sudah dipakai produk lain.", fieldErrors: { slug: ["Sudah dipakai"] } };
    }
    throw err;
  }

  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  redirect(`/admin/inventory/${createdId}`);
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      error: "Periksa kembali data isian.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        categoryId: data.categoryId || null,
        price: new Prisma.Decimal(data.price),
        compareAt:
          data.compareAt === "" || data.compareAt == null
            ? null
            : new Prisma.Decimal(data.compareAt),
        stock: data.stock,
        weightGram: data.weightGram,
        status: data.status,
      },
    });

    if (data.primaryImageUrl) {
      // Replace primary image (position 0). Keep additional images intact.
      const existing = await prisma.productImage.findFirst({
        where: { productId: id, position: 0 },
      });
      if (existing) {
        await prisma.productImage.update({
          where: { id: existing.id },
          data: { url: data.primaryImageUrl },
        });
      } else {
        await prisma.productImage.create({
          data: { productId: id, url: data.primaryImageUrl, position: 0 },
        });
      }
    }
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "Slug sudah dipakai produk lain.", fieldErrors: { slug: ["Sudah dipakai"] } };
    }
    throw err;
  }

  revalidatePath("/admin/inventory");
  revalidatePath(`/admin/inventory/${id}`);
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  return {};
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  revalidatePath("/products");
  redirect("/admin/inventory");
}
