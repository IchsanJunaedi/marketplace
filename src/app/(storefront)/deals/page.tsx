/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";

export const metadata = {
  title: "EnterpriseStore - Deals",
  description: "Best deals and discounts on enterprise products.",
};

export const revalidate = 60;

export default async function DealsPage() {
  // Products with a compareAt price (= on sale)
  const deals = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      compareAt: { not: null },
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
  });

  // All active products for "More Products" section
  const allProducts = await prisma.product.findMany({
    where: { status: "ACTIVE", compareAt: null },
    orderBy: { price: "asc" },
    take: 6,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
  });

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar active="Deals" />
      <main className="flex-1 pt-24 pb-12 px-6 w-full max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Hero banner */}
        <section className="bg-primary rounded-lg p-8 flex flex-col gap-3">
          <span className="font-label-caps text-label-caps text-on-primary/70 uppercase tracking-widest">
            Limited Time
          </span>
          <h1 className="font-h1 text-h1 text-on-primary text-3xl font-black">
            Flash Deals &amp; Special Offers
          </h1>
          <p className="font-body-md text-body-md text-on-primary/80 max-w-xl">
            Save big on selected enterprise products. Deals are updated
            regularly — grab them while stock lasts.
          </p>
        </section>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <section className="flex flex-col gap-4">
            <h2 className="font-h2 text-h2 text-on-background border-b border-surface-variant pb-3">
              🔥 On Sale Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((p) => {
                const discount = p.compareAt
                  ? Math.round(
                      ((Number(p.compareAt) - Number(p.price)) /
                        Number(p.compareAt)) *
                        100,
                    )
                  : 0;
                return (
                  <div
                    key={p.id}
                    className="bg-surface-container-lowest border border-surface-variant rounded overflow-hidden flex flex-col group hover:border-outline transition-colors"
                  >
                    <div className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center">
                      <div className="absolute top-2 left-2 bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded font-label-caps text-label-caps uppercase font-bold">
                        {discount}% OFF
                      </div>
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
                          <div className="font-body-sm text-body-sm text-on-surface-variant line-through">
                            ${Number(p.compareAt).toFixed(2)}
                          </div>
                          <div className="font-h2 text-h2 text-primary">
                            ${Number(p.price).toFixed(2)}
                          </div>
                        </div>
                        <AddToCartButton
                          productId={p.id}
                          className="bg-primary text-on-primary hover:bg-surface-tint px-3 py-1.5 rounded font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center py-16 gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px]">
              local_offer
            </span>
            <p className="font-h2 text-h2">No active deals right now</p>
            <p className="font-body-md text-body-md">Check back soon!</p>
          </div>
        )}

        {/* More Products */}
        {allProducts.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-h2 text-h2 text-on-background border-b border-surface-variant pb-3">
              More Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest border border-surface-variant rounded overflow-hidden flex flex-col group hover:border-outline transition-colors"
                >
                  <div className="h-40 w-full bg-surface-container relative p-4 flex items-center justify-center">
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
                    <h4 className="font-body-md text-body-md font-medium text-on-background mb-1 leading-snug line-clamp-2">
                      {p.name}
                    </h4>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="font-h2 text-h2 text-on-background">
                        ${Number(p.price).toFixed(2)}
                      </div>
                      <AddToCartButton productId={p.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
