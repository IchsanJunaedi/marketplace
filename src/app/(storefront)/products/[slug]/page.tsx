import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { submitReview } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  const userCanReview = session?.user && await prisma.orderItem.findFirst({
    where: {
      order: {
        userId: session.user.id,
        status: "DELIVERED",
      },
      productId: product.id,
    },
  }) && !product.reviews.some(r => r.userId === session.user?.id);

  return (
    <div className={`bg-background min-h-screen text-on-background antialiased font-body-md text-body-md`}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-surface-variant flex justify-between items-center px-6 h-16 mx-auto">
        <div className="flex items-center gap-8">
          <a href="/" className="font-h1 text-h1 font-black text-on-background tracking-tight">EnterpriseStore</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/cart" className="text-on-surface-variant hover:text-on-surface p-2"><span className="material-symbols-outlined">shopping_cart</span></a>
          <a href="/account" className="text-on-surface-variant hover:text-on-surface p-2"><span className="material-symbols-outlined">account_circle</span></a>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-6">
          <a className="hover:text-primary transition-colors" href="/products">Shop</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-on-surface font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Images */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
            <div className="aspect-[4/3] rounded-lg bg-surface-container overflow-hidden border border-outline-variant relative flex items-center justify-center">
              {product.images[0] ? (
                <img alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" src={product.images[0].url} />
              ) : (
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant">image</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg border border-outline-variant overflow-hidden">
                  <img src={img.url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-variant rounded-xl p-6 flex flex-col gap-6 sticky top-24">
            <div className="flex flex-col gap-2">
              <h1 className="font-h1 text-h1 text-on-surface">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex text-tertiary-container">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${s <= avgRating ? 1 : 0}` }}>star</span>
                  ))}
                </div>
                <span className="text-on-surface-variant text-sm">({product.reviews.length} Reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-h1 text-[32px] font-bold tracking-tight text-on-surface">{formatIDR(product.price.toNumber())}</span>
              {product.compareAt && (
                <span className="font-body-md text-body-md text-on-surface-variant line-through">{formatIDR(product.compareAt.toNumber())}</span>
              )}
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded w-fit border ${product.stock > 0 ? "bg-secondary-container text-on-secondary-container border-secondary-fixed-dim" : "bg-error-container text-on-error-container border-error"}`}>
              <span className="material-symbols-outlined text-[18px]">{product.stock > 0 ? "check_circle" : "error"}</span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider">
                {product.stock > 0 ? `In Stock - ${product.stock} units` : "Out of Stock"}
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full bg-primary text-on-primary font-body-md text-body-md font-medium h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50" disabled={product.stock === 0}>
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-black mb-8">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-4">
              {userCanReview ? (
                <ReviewForm productId={product.id} onSubmit={submitReview} />
              ) : (
                <div className="bg-surface-container-low border border-surface-variant rounded-xl p-6 text-sm text-on-surface-variant italic">
                  {session?.user 
                    ? "You can review this product after your order has been delivered." 
                    : "Please sign in to leave a review."}
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              {product.reviews.length === 0 ? (
                <p className="text-on-surface-variant italic">No reviews yet. Be the first to review!</p>
              ) : (
                product.reviews.map((r) => (
                  <div key={r.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {r.user.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.user.name}</p>
                          <div className="flex text-tertiary-container">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' ${s <= r.rating ? 1 : 0}` }}>star</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">
                        {r.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-2">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
