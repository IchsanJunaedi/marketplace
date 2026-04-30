import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductById, listCategories } from "@/lib/products";
import { deleteProduct, updateProduct } from "../actions";
import { ProductForm } from "../product-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategories(),
  ]);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);
  const boundDelete = async () => {
    "use server";
    await deleteProduct(id);
  };

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
          <h1 className="font-h1 text-h1 text-on-surface mt-2">
            Edit Product
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            ID: <span className="font-mono">{product.id}</span>
          </p>
        </div>
      </header>
      <ProductForm
        action={boundUpdate}
        categories={categories}
        submitLabel="Save changes"
        cancelHref="/admin/inventory"
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          categoryId: product.category?.id ?? "",
          price: product.price,
          compareAt: product.compareAt ?? "",
          stock: product.stock,
          weightGram: product.weightGram,
          status: product.status,
          primaryImageUrl: product.primaryImageUrl ?? "",
        }}
        deleteAction={boundDelete}
      />
    </main>
  );
}
