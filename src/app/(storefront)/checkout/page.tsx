/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */
// Originally ported from template/checkout_process/code.html — design preserved
// 1:1; bindings replaced with live cart + place-order server action.
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCartViewByUser } from "@/lib/cart";
import { CheckoutForm } from "./checkout-form";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsDCgWsS230i1FJsA-o6zAp9GS-3wHXePdx7wRM3v2ZERus2i56vMco8hK8qmnlNi73YMOUdW_pqp_I8TBewly_WhGrkQ9VjlomNSREh-xKfaIZ1wv0uPtTdjEJ9ykGu7QgFq-V1R-G47yAHhr1TGTpe9-Mu9cUgHd_AFPP7zczKrtEUrzIGD3qKIwuko2qSvs4ZMk5rxpNQgU5wZdzXExEJpZhNmj3-LgMD3za1lXDigjmITh-I3DGZamsp5lP8D4Excz2hIDWK9U";

const SHIPPING_REG = 15;
const TAX_RATE = 0.08;

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  const user = session?.user as { id?: string; name?: string | null } | undefined;
  if (!user?.id) redirect("/auth/signin?next=/checkout");

  const cart = await getCartViewByUser(user.id);
  const lines = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shipping = lines.length > 0 ? SHIPPING_REG : 0;
  const total = subtotal + shipping + tax;

  return (
    <div className={`bg-surface-container-low text-on-surface antialiased font-body-md min-h-screen flex flex-col`}>
{/*  Minimal Header for Transactional Page  */}
<header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50">
<div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
<Link href="/" className="text-xl font-black text-on-background tracking-tight">EnterpriseStore</Link>
<div className="flex items-center gap-2 text-secondary font-body-sm">
<span className="material-symbols-outlined icon-fill text-sm">lock</span>
<span>Secure Checkout</span>
</div>
</div>
</header>
{/*  Main Content  */}
<main className="flex-grow max-w-[1440px] mx-auto w-full px-6 py-8">
<div className="mb-6">
<h1 className="font-h1 text-h1 text-on-background">Checkout</h1>
</div>
{lines.length === 0 ? (
<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-container-padding text-center">
<p className="font-h2 text-h2 text-on-surface mb-2">Keranjang kosong</p>
<p className="font-body-md text-body-md text-on-surface-variant mb-4">
  Tambah produk ke keranjang dulu sebelum checkout.
</p>
<Link
  href="/products"
  className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors"
>
  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>storefront</span>
  Browse Products
</Link>
</div>
) : (
<div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap items-start">
{/*  Left Column: Multi-Step Form  */}
<div className="lg:col-span-8">
<CheckoutForm defaultName={user.name ?? null} hasItems={lines.length > 0} />
</div>
{/*  Right Column: Order Summary  */}
<div className="lg:col-span-4">
<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-container-padding sticky top-24">
<h2 className="font-h2 text-h2 text-on-surface mb-6 pb-4 border-b border-surface-variant">Order Summary</h2>
{/*  Items  */}
<div className="space-y-4 mb-6 pb-6 border-b border-surface-variant">
{lines.map((line) => (
<div key={line.id} className="flex gap-4">
<div className="w-16 h-16 rounded border border-outline-variant bg-surface overflow-hidden flex-shrink-0">
<img alt={line.product.primaryImageAlt ?? line.product.name} className="w-full h-full object-cover" src={line.product.primaryImageUrl ?? PLACEHOLDER} />
</div>
<div className="flex-grow flex flex-col justify-between">
<div>
<h3 className="font-body-md text-body-md text-on-background font-medium line-clamp-1">{line.product.name}</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Qty: {line.quantity}</p>
</div>
<div className="font-data-tabular text-data-tabular text-on-background text-right">{fmt.format(line.lineTotal)}</div>
</div>
</div>
))}
</div>
{/*  Calculations  */}
<div className="space-y-3 mb-6">
<div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
<span>Subtotal</span>
<span className="font-data-tabular text-data-tabular text-on-background">{fmt.format(subtotal)}</span>
</div>
<div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
<span>Shipping (JNE REG)</span>
<span className="font-data-tabular text-data-tabular text-on-background">{fmt.format(shipping)}</span>
</div>
<div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
<span>Tax (8%)</span>
<span className="font-data-tabular text-data-tabular text-on-background">{fmt.format(tax)}</span>
</div>
</div>
{/*  Total  */}
<div className="flex justify-between items-center mb-2 pt-4 border-t border-surface-variant">
<span className="font-h2 text-h2 text-on-background">Total</span>
<span className="font-h1 text-h1 text-primary font-bold">{fmt.format(total)}</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
  Total dihitung berdasarkan JNE REG. Kalau pilih JNE YES, biaya kirim akan disesuaikan saat order dibuat.
</p>
</div>
</div>
</div>
)}
</main>
    </div>
  );
}
