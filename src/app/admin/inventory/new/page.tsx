import Link from "next/link";

import { ProductStatus } from "@/generated/prisma/client";
import { listCategories } from "@/lib/products";
import { createProduct } from "../actions";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <main className="theme-admin min-h-screen bg-background p-lg lg:p-xl">
      <header className="max-w-[960px] mx-auto mb-lg flex items-center justify-between">
        <div>
          <Link
            href="/admin/inventory"
            className="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Inventory
          </Link>
          <h1 className="font-h1 text-h1 text-on-surface mt-2">New Product</h1>
        </div>
      </header>
      <ProductForm
        action={createProduct}
        categories={categories}
        submitLabel="Create"
        cancelHref="/admin/inventory"
        initial={{
          name: "",
          slug: "",
          description: "",
          categoryId: "",
          price: "",
          compareAt: "",
          stock: 0,
          weightGram: 0,
          status: ProductStatus.DRAFT,
          primaryImageUrl: "",
        }}
      />
    </main>
  );
}
