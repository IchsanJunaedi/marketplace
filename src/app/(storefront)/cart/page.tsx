/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
// Originally ported from template/shopping_cart/code.html — design preserved
// 1:1; bindings replaced with live cart data + server actions.
import Link from "next/link";

import { auth } from "@/auth";
import { getCartViewByUser } from "@/lib/cart";
import { redirect } from "next/navigation";

import {
  addToCartAction as _addToCartAction,
  adjustCartItemAction,
  removeCartItemAction,
} from "./actions";

// Suppress unused-import lint for re-exported actions referenced only by name.
void _addToCartAction;

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCnSIJZevt7vjYHlOB6D08ZZy70bz71oEAOdj_WEH4Cp-nn1TvlfFSSRsCC29KpLd2RSwMGmzqz5LfkjSuQTpg2sEvuxeF_Q5HrAosrTH1pF23ZBu5QdyiUsjhciJDJWJa48h-fXYe7JgRCjk5Cek8sL9NWxoWcsMw5WQx8G0lZwDcbFb8MZLUUo8CRGVqNrdM71m3ix5uZMK7vNXxV27Vmg2mL14vptQ-Vqi7BMEHXScAHI6BV5LMZELMIMMViuACfNoILU5nvAx4n";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const user = session?.user as { id?: string; name?: string | null } | undefined;
  if (!user?.id) redirect("/auth/signin?next=/cart");

  const cart = await getCartViewByUser(user.id);
  const lines = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const itemCount = cart?.itemCount ?? 0;
  const taxEstimate = subtotal * 0.08;
  const total = subtotal + taxEstimate;

  const initials =
    (user.name ?? "")
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className={`bg-surface-container-low text-on-surface font-body-md antialiased min-h-screen`}>
{/*  TopNavBar  */}
<nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flat no shadows fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 max-w-[1440px] mx-auto docked full-width top-0 border-b">
<div className="flex items-center gap-8">
<div className="text-xl font-black text-gray-900 dark:text-white">
                EnterpriseStore
            </div>
<div className="hidden md:flex gap-6 font-inter text-sm font-medium">
<Link className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-1 active:scale-95 transition-transform duration-150" href="/products">Shop</Link>
<a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 transition-transform duration-150" href="#">Categories</a>
<a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 transition-transform duration-150" href="#">Deals</a>
<a className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95 transition-transform duration-150" href="#">Support</a>
</div>
</div>
<div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
<Link className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-150 relative" href="/cart">
<span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
{itemCount > 0 ? (
  <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{itemCount}</span>
) : null}
</Link>
<Link className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-2 rounded-full active:scale-95 transition-transform duration-150" href="/account">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</Link>
</div>
</nav>
{/*  SideNavBar  */}
<aside className="bg-gray-900 dark:bg-black border-r border-gray-800 flat no shadows fixed left-0 top-0 h-screen flex flex-col pt-16 h-full w-64 border-r border-gray-800 hidden md:flex z-40">
<div className="p-6 border-b border-gray-800">
<div className="flex items-center gap-3 mb-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary-fixed-dim font-bold">
                    {initials}
                </div>
<div>
<div className="text-white text-lg font-bold">{user.name ?? "Customer"}</div>
<div className="font-inter text-sm antialiased text-gray-400">Premium Member</div>
</div>
</div>
</div>
<nav className="flex-1 py-4 font-inter text-sm antialiased">
<Link className="flex items-center gap-3 text-gray-400 px-4 py-3 hover:text-white hover:bg-gray-800 transition-all duration-200 active:bg-gray-700 transition-colors" href="/account">
<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
                Dashboard
            </Link>
<Link className="flex items-center gap-3 bg-gray-800 text-white border-l-4 border-blue-600 px-4 py-3 hover:bg-gray-800 transition-all duration-200 active:bg-gray-700 transition-colors" href="/cart">
<span className="material-symbols-outlined" data-icon="package_2">package_2</span>
                My Orders
            </Link>
<a className="flex items-center gap-3 text-gray-400 px-4 py-3 hover:text-white hover:bg-gray-800 transition-all duration-200 active:bg-gray-700 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="favorite">favorite</span>
                Wishlist
            </a>
<a className="flex items-center gap-3 text-gray-400 px-4 py-3 hover:text-white hover:bg-gray-800 transition-all duration-200 active:bg-gray-700 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
                Account Settings
            </a>
<a className="flex items-center gap-3 text-gray-400 px-4 py-3 hover:text-white hover:bg-gray-800 transition-all duration-200 active:bg-gray-700 transition-colors" href="#">
<span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
                Support
            </a>
</nav>
</aside>
{/*  Main Content Canvas  */}
<main className="md:ml-64 pt-20 px-6 pb-12 max-w-[1440px] mx-auto min-h-screen flex flex-col">
<div className="mb-card-gap">
<h1 className="font-h1 text-h1 text-on-background">Shopping Cart</h1>
</div>
<div className="flex flex-col lg:flex-row gap-card-gap items-start">
{/*  Cart Items Data Table (Bento style container)  */}
<div className="flex-1 w-full bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden">
<div className="px-container-padding py-4 border-b border-surface-variant bg-surface-bright flex justify-between items-center">
<span className="font-data-tabular text-data-tabular text-on-surface-variant uppercase tracking-wider">Item Details</span>
<span className="font-data-tabular text-data-tabular text-on-surface-variant uppercase tracking-wider pl-12">Action</span>
</div>
<div className="flex flex-col">
{lines.length === 0 ? (
  <div className="p-container-padding text-center">
    <p className="font-body-md text-body-md text-on-surface-variant mb-4">
      Keranjang Anda masih kosong.
    </p>
    <Link
      className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-DEFAULT font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors"
      href="/products"
    >
      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>storefront</span>
      Browse Products
    </Link>
  </div>
) : (
  lines.map((line, idx) => (
<div key={line.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-container-padding ${idx === lines.length - 1 ? "" : "border-b border-surface-variant"} hover:bg-surface-bright transition-colors`}>
<div className="flex items-center gap-4 flex-1">
<img alt={line.product.primaryImageAlt ?? line.product.name} className="w-16 h-16 object-cover rounded-DEFAULT border border-surface-variant" src={line.product.primaryImageUrl ?? PLACEHOLDER} />
<div>
<Link className="font-h2 text-h2 text-on-surface mb-1 hover:text-primary transition-colors block" href={`/products/${line.product.slug}`}>{line.product.name}</Link>
<div className="font-body-sm text-body-sm text-on-surface-variant">SKU: {line.product.id.slice(0, 12).toUpperCase()}</div>
<div className="font-data-tabular text-data-tabular text-primary mt-1">{fmt.format(line.unitPrice)}</div>
</div>
</div>
<div className="flex items-center gap-8 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
<div className="flex items-center border border-outline-variant rounded-DEFAULT h-9 bg-surface-container-lowest">
<form action={adjustCartItemAction}>
<input type="hidden" name="itemId" value={line.id} />
<input type="hidden" name="delta" value="-1" />
<button type="submit" aria-label="Decrease quantity" className="w-9 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-l-DEFAULT">
<span className="material-symbols-outlined" data-icon="remove" style={{ fontSize: "18px" }}>remove</span>
</button>
</form>
<input className="w-12 h-full text-center border-x border-outline-variant border-y-0 font-data-tabular text-data-tabular focus:ring-0 focus:border-outline-variant bg-surface-container-lowest p-0" type="text" value={line.quantity} readOnly />
<form action={adjustCartItemAction}>
<input type="hidden" name="itemId" value={line.id} />
<input type="hidden" name="delta" value="1" />
<button type="submit" aria-label="Increase quantity" disabled={line.quantity >= line.product.stock} className="w-9 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-r-DEFAULT disabled:opacity-50">
<span className="material-symbols-outlined" data-icon="add" style={{ fontSize: "18px" }}>add</span>
</button>
</form>
</div>
<div className="w-24 text-right font-data-tabular text-data-tabular text-on-surface font-semibold">
                                {fmt.format(line.lineTotal)}
                            </div>
<form action={removeCartItemAction}>
<input type="hidden" name="itemId" value={line.id} />
<button type="submit" className="text-on-surface-variant hover:text-error transition-colors p-2" title="Remove item" aria-label="Remove item">
<span className="material-symbols-outlined" data-icon="delete">delete</span>
</button>
</form>
</div>
</div>
))
)}
</div>
</div>
{/*  Order Summary Sidebar  */}
<div className="w-full lg:w-[380px] flex flex-col gap-card-gap">
<div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-container-padding flex flex-col shadow-sm">
<h2 className="font-h2 text-h2 text-on-surface mb-6 border-b border-surface-variant pb-4">Order Summary</h2>
<div className="flex flex-col gap-4 mb-6">
<div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
<span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
<span className="font-data-tabular text-data-tabular text-on-surface">{fmt.format(subtotal)}</span>
</div>
<div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
<span>Shipping</span>
<span className="font-data-tabular text-data-tabular text-on-surface">Calculated at checkout</span>
</div>
<div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
<span>Tax (Estimated)</span>
<span className="font-data-tabular text-data-tabular text-on-surface">{fmt.format(taxEstimate)}</span>
</div>
</div>
{/*  Voucher Input  */}
<div className="mb-6 bg-surface-bright p-4 rounded-DEFAULT border border-surface-variant">
<label className="block font-label-caps text-label-caps text-on-surface-variant mb-2" htmlFor="voucher">Voucher Diskon</label>
<div className="flex">
<input className="flex-1 bg-surface-container-lowest border border-outline-variant border-r-0 rounded-l-DEFAULT px-3 py-2 font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-shadow placeholder-outline-variant" id="voucher" placeholder="Enter code" type="text" />
<button className="bg-surface-container text-on-surface px-4 py-2 border border-outline-variant rounded-r-DEFAULT font-label-caps text-label-caps hover:bg-surface-variant transition-colors">
                                Apply
                            </button>
</div>
</div>
<div className="border-t border-surface-variant pt-4 mb-6">
<div className="flex justify-between items-end">
<span className="font-h2 text-h2 text-on-surface">Total</span>
<span className="font-h1 text-h1 text-primary">{fmt.format(total)}</span>
</div>
</div>
<Link href={lines.length === 0 ? "/products" : "/checkout"} aria-disabled={lines.length === 0} className={`w-full bg-primary text-on-primary py-3 rounded-DEFAULT font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 ${lines.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>
<span className="material-symbols-outlined" data-icon="lock" style={{ fontSize: "18px" }}>lock</span>
                        Proceed to Checkout
                    </Link>
</div>
</div>
</div>
</main>
    </div>
  );
}
