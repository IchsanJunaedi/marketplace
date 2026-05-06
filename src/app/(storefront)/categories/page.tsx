/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";

export const metadata = {
  title: "EnterpriseStore - Categories",
  description: "Browse all product categories.",
};

export const revalidate = 60; // revalidate every 60s

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "rating"
          ? { createdAt: "desc" as const }
          : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(category
        ? { category: { slug: category } }
        : {}),
    },
    orderBy,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
  });

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar active="Categories" />
      <main className="flex-1 pt-24 pb-12 px-6 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-surface-container-lowest border border-surface-variant rounded p-5 flex flex-col gap-6 sticky top-24">
          <div>
            <h3 className="font-h2 text-h2 text-on-background mb-3">
              Categories
            </h3>
            <div className="flex flex-col gap-1">
              <a
                href="/categories"
                className={`flex items-center justify-between px-3 py-2 rounded font-body-sm text-body-sm transition-colors ${!category ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"}`}
              >
                <span>All Products</span>
                <span className="font-data-tabular text-[11px]">
                  {products.length}
                </span>
              </a>
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <a
                    key={cat.id}
                    href={`/categories?category=${cat.slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded font-body-sm text-body-sm transition-colors ${isActive ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"}`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-data-tabular text-[11px]">
                      {cat._count.products}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
          <hr className="border-surface-variant" />
          <div>
            <h3 className="font-h2 text-h2 text-on-background mb-3">Sort by</h3>
            <div className="flex flex-col gap-1">
              {[
                { label: "Newest", value: "" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
              ].map((opt) => {
                const isActive = (sort ?? "") === opt.value;
                const href = `/categories${category ? `?category=${category}&` : "?"}sort=${opt.value}`;
                return (
                  <a
                    key={opt.value}
                    href={href}
                    className={`px-3 py-2 rounded font-body-sm text-body-sm transition-colors ${isActive ? "bg-secondary-container text-surface-tint font-medium" : "text-on-surface hover:bg-surface-container"}`}
                  >
                    {opt.label}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-surface-container-lowest border border-surface-variant rounded p-3">
            <div className="font-body-md text-body-md text-on-surface">
              Showing{" "}
              <span className="font-semibold">{products.length}</span> products
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px]">
                inventory_2
              </span>
              <p className="font-h2 text-h2">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest border border-surface-variant rounded overflow-hidden flex flex-col group hover:border-outline transition-colors"
                >
                  <div className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center">
                    {p.compareAt && (
                      <div className="absolute top-2 left-2 bg-surface-container-lowest text-primary border border-outline-variant px-1.5 py-0.5 rounded font-label-caps text-label-caps uppercase">
                        Sale
                      </div>
                    )}
                    {p.stock <= 10 && p.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-label-caps text-label-caps uppercase">
                        Low Stock
                      </div>
                    )}
                    <img
                      alt={p.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                      src={
                        p.images[0]?.url ??
                        "https://placehold.co/200x200?text=No+Image"
                      }
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1 border-t border-surface-variant">
                    {p.category && (
                      <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                        {p.category.name}
                      </div>
                    )}
                    <h4 className="font-body-md text-body-md font-medium text-on-background mb-3 leading-snug line-clamp-2">
                      {p.name}
                    </h4>
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        {p.compareAt && (
                          <div className="font-body-sm text-body-sm text-on-surface-variant line-through">
                            ${Number(p.compareAt).toFixed(2)}
                          </div>
                        )}
                        <div className="font-h2 text-h2 text-on-background">
                          ${Number(p.price).toFixed(2)}
                        </div>
                      </div>
                      <AddToCartButton productId={p.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
