/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  // Fetch a few active products for featured section
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar active="Shop" />
      <main className="pt-24 pb-16 max-w-[1440px] mx-auto px-6 lg:px-container-padding flex flex-col gap-12">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap items-center">
          <div className="lg:col-span-5 flex flex-col items-start gap-6 pr-0 lg:pr-8">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider bg-surface-variant px-3 py-1 rounded-sm">
              100% Organik & Alami
            </span>
            <h1 className="font-h1 text-h1 text-on-background leading-tight text-4xl lg:text-5xl">
              Kebaikan Alam untuk Kesehatan Optimal Anda.
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-lg max-w-[32rem]">
              Temukan produk herbal berkualitas tinggi, minyak atsiri murni, suplemen alami, dan rempah pilihan langsung dari bumi nusantara untuk kebugaran tubuh Anda setiap hari.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link href="/products" className="bg-primary text-on-primary font-data-tabular text-data-tabular px-6 py-3 rounded hover:bg-surface-tint transition-colors active:scale-95 shadow-sm">
                Jelajahi Katalog
              </Link>
              <Link href="/categories" className="border border-outline bg-transparent text-on-surface font-data-tabular text-data-tabular px-6 py-3 rounded hover:bg-surface-container transition-colors active:scale-95">
                Kategori Produk
              </Link>
            </div>
          </div>
          
          {/* Hero Grid Images */}
          <div className="lg:col-span-7 grid grid-cols-12 grid-rows-2 gap-unit h-[450px] mt-8 lg:mt-0">
            <div className="col-span-12 md:col-span-8 row-span-2 relative rounded overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="Herbal medicine ingredients arranged on a wooden table"
                src="https://images.unsplash.com/photo-1508740075923-923f5d12fc0d?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-data-tabular text-data-tabular text-white bg-black/50 backdrop-blur-sm w-fit px-3 py-1 rounded-sm border border-white/20">
                  Khasiat Alami Nusantara
                </p>
              </div>
            </div>
            <div className="hidden md:block col-span-4 row-span-1 rounded overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="Glass jar of pure raw honey with dipper"
                src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"
              />
            </div>
            <div className="hidden md:block col-span-4 row-span-1 rounded overflow-hidden border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                alt="Cup of chamomile tea with fresh flowers"
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80"
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="flex flex-col gap-6 mt-8">
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <h2 className="font-h2 text-h2 text-on-background">Kategori Pilihan</h2>
            <Link href="/categories" className="font-body-sm text-body-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-card-gap">
            <Link href="/products?category=obat-herbal" className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group">
              <div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">medication</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface text-center font-medium">Obat Herbal</span>
            </Link>
            <Link href="/products?category=teh-seduhan" className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group">
              <div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">emoji_food_beverage</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface text-center font-medium">Teh & Seduhan</span>
            </Link>
            <Link href="/products?category=minyak-atsiri" className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group">
              <div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">spa</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface text-center font-medium">Minyak Atsiri</span>
            </Link>
            <Link href="/products?category=suplemen-alami" className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group">
              <div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">health_and_safety</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface text-center font-medium">Suplemen Alami</span>
            </Link>
            <Link href="/products?category=rempah-pilihan" className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col items-center justify-center gap-4 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:border-outline transition-all cursor-pointer group">
              <div className="bg-surface-container-low p-3 rounded-full group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-primary-container transition-colors">eco</span>
              </div>
              <span className="font-data-tabular text-data-tabular text-on-surface text-center font-medium">Rempah Pilihan</span>
            </Link>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="flex flex-col gap-6 mt-8">
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <h2 className="font-h2 text-h2 text-on-background">Produk Terlaris</h2>
            <Link href="/products" className="font-body-sm text-body-sm text-primary hover:underline flex items-center gap-1">
              Lihat Semua Produk <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-on-surface-variant italic">Belum ada produk terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-surface-container-lowest border border-surface-variant rounded overflow-hidden flex flex-col group hover:border-outline transition-colors">
                  <Link href={`/products/${product.slug}`} className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center overflow-hidden">
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
                    <span className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <Link href={`/products/${product.slug}`} className="font-body-md text-body-md font-medium text-on-background mb-2 leading-snug hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </Link>
                    
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <div>
                        {product.compareAt && (
                          <div className="font-body-sm text-body-sm text-on-surface-variant line-through">
                            {formatIDR(product.compareAt.toNumber())}
                          </div>
                        )}
                        <div className="font-h2 text-h2 text-on-background font-semibold">
                          {formatIDR(product.price.toNumber())}
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
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
