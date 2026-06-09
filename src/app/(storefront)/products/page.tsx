import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { auth } from "@/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import { Prisma } from "@/generated/prisma/client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const session = await auth();
  const isWholesaleUser = (session?.user as { isWholesale?: boolean })?.isWholesale ?? false;

  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;
  const searchVal = resolvedParams.search;

  // Build prisma query options
  const whereClause: Prisma.ProductWhereInput = { status: "ACTIVE" };
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }
  if (searchVal) {
    whereClause.name = { contains: searchVal };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col">
      <Navbar active="Shop" />

      <main className="flex-1 pt-24 pb-12 px-6 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-surface-container-lowest border border-surface-variant rounded p-5 flex flex-col gap-6 sticky top-24">
          <div>
            <h3 className="font-h2 text-h2 text-on-background mb-3">Kategori</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/products"
                className={`font-body-sm text-body-sm py-1.5 px-3 rounded transition-colors ${
                  !categorySlug
                    ? "bg-primary text-on-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Semua Produk
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`font-body-sm text-body-sm py-1.5 px-3 rounded transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-primary text-on-primary font-medium"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          {searchVal && (
            <div className="border-t border-surface-variant pt-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2">Pencarian</span>
              <div className="flex justify-between items-center bg-surface-container p-2 rounded text-sm">
                <span className="truncate">&quot;{searchVal}&quot;</span>
                <Link href="/products" className="material-symbols-outlined text-[16px] hover:text-error">
                  close
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center bg-surface-container-lowest border border-surface-variant rounded p-3">
            <div className="font-body-md text-body-md text-on-surface">
              Menampilkan <span className="font-semibold">{products.length}</span> produk
            </div>
            {isWholesaleUser && (
              <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded text-[10px] font-bold uppercase">
                Grosir Aktif
              </span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="bg-surface-container-lowest border border-surface-variant rounded p-12 text-center text-on-surface-variant italic">
              Produk tidak ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => {
                const displayPrice = isWholesaleUser && product.wholesalePrice
                  ? product.wholesalePrice.toNumber()
                  : product.price.toNumber();
                const hasWholesaleDiscount = isWholesaleUser && product.wholesalePrice;

                return (
                  <div
                    key={product.id}
                    className="bg-surface-container-lowest border border-surface-variant rounded overflow-hidden flex flex-col group hover:border-outline transition-colors"
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center overflow-hidden"
                    >
                      {product.images[0] ? (
                        <img
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          src={product.images[0].url}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[48px] text-on-surface-variant">image</span>
                      )}
                    </Link>
                    <div className="p-4 flex flex-col flex-1 border-t border-surface-variant">
                      <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                        {product.category?.name || "Uncategorized"}
                      </div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-body-md text-body-md font-medium text-on-background mb-2 leading-snug line-clamp-2 hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div>
                          {hasWholesaleDiscount && (
                            <div className="font-body-sm text-body-sm text-on-surface-variant line-through">
                              {formatIDR(product.price.toNumber())}
                            </div>
                          )}
                          <div className={`font-h2 text-h2 font-semibold ${hasWholesaleDiscount ? "text-primary" : "text-on-background"}`}>
                            {formatIDR(displayPrice)}
                          </div>
                        </div>
                        <AddToCartButton
                          productId={product.id}
                          disabled={product.stock === 0}
                          label="Beli"
                          className="border border-outline text-primary hover:bg-surface-container px-3.5 py-1.5 rounded font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1 active:scale-95 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
