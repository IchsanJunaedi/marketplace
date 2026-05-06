import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { auth } from "@/auth";

export default async function ProductsPage() {
  const session = await auth();
  const isWholesaleUser = (session?.user as { isWholesale?: boolean })?.isWholesale ?? false;

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={`bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col`}>
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-surface-variant flex justify-between items-center px-6 h-16 mx-auto">
        <div className="flex items-center gap-8">
          <a href="/" className="font-h1 text-h1 font-black text-on-background tracking-tight">EnterpriseStore</a>
          <nav className="hidden md:flex items-center gap-6 mt-1">
            <a className="font-body-md text-body-md font-medium text-primary border-b-2 border-primary pb-1" href="/products">Shop</a>
            <a className="font-body-md text-body-md font-medium text-on-surface-variant hover:text-on-surface" href="/categories">Categories</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="/cart" className="text-on-surface-variant hover:text-on-surface p-2">
            <span className="material-symbols-outlined">shopping_cart</span>
          </a>
          <a href="/account" className="text-on-surface-variant hover:text-on-surface p-2">
            <span className="material-symbols-outlined">account_circle</span>
          </a>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-6 w-full max-w-[1440px] mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* Filters Placeholder */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-surface-container-lowest border border-surface-variant rounded-DEFAULT p-5 flex flex-col gap-6 sticky top-24">
          <h3 className="font-h2 text-h2 text-on-background mb-3">Filters</h3>
          <p className="text-on-surface-variant text-sm italic">Filter implementation coming soon.</p>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-surface-container-lowest border border-surface-variant rounded-DEFAULT p-3">
            <div className="font-body-md text-body-md text-on-surface">Showing <span className="font-semibold">{products.length}</span> results</div>
            {isWholesaleUser && (
              <span className="bg-primary-container text-on-primary-container px-2 py-1 rounded text-[10px] font-bold uppercase">Wholesale Mode Active</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const displayPrice = isWholesaleUser && product.wholesalePrice 
                ? product.wholesalePrice.toNumber() 
                : product.price.toNumber();
              const hasWholesaleDiscount = isWholesaleUser && product.wholesalePrice;

              return (
                <div key={product.id} className="bg-surface-container-lowest border border-surface-variant rounded-DEFAULT overflow-hidden flex flex-col group hover:border-outline transition-colors">
                  <div className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center">
                    {product.images[0] ? (
                      <img alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" src={product.images[0].url} />
                    ) : (
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant">image</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 border-t border-surface-variant">
                    <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">{product.category?.name || "Uncategorized"}</div>
                    <h4 className="font-body-md text-body-md font-medium text-on-background mb-1 leading-snug line-clamp-2">{product.name}</h4>
                    
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        {hasWholesaleDiscount && (
                          <div className="font-body-sm text-body-sm text-on-surface-variant line-through">{formatIDR(product.price.toNumber())}</div>
                        )}
                        <div className={`font-h2 text-h2 ${hasWholesaleDiscount ? "text-primary" : "text-on-background"}`}>
                          {formatIDR(displayPrice)}
                        </div>
                      </div>
                      <button className="border border-outline text-primary hover:bg-surface-container px-3 py-1.5 rounded-DEFAULT font-body-sm text-body-sm font-medium transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
