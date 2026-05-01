import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getCart } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import CartItemRow from "@/components/CartItemRow";

export const metadata = {
  title: "EnterpriseStore - Shopping Cart",
};

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?redirectTo=/cart");
  }

  const cart = await getCart();
  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md antialiased min-h-screen">
      <Navbar active="Cart" />

      <main className="pt-24 px-6 pb-12 max-w-[1440px] mx-auto min-h-screen flex flex-col">
        <div className="mb-6">
          <h1 className="font-h1 text-h1 text-on-background">Shopping Cart</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {items.length === 0
              ? "Your cart is empty."
              : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 py-24">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant">
              shopping_cart
            </span>
            <p className="font-h2 text-h2 text-on-surface-variant">
              Your cart is empty
            </p>
            <Link
              href="/categories"
              className="bg-primary text-on-primary px-6 py-2.5 rounded font-body-md text-body-md hover:bg-surface-tint transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Cart Items */}
            <div className="flex-1 w-full bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-variant bg-surface-bright flex justify-between items-center">
                <span className="font-data-tabular text-data-tabular text-on-surface-variant uppercase tracking-wider">
                  Item Details
                </span>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant uppercase tracking-wider">
                  Action
                </span>
              </div>

              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  id={item.id}
                  name={item.product.name}
                  sku={item.product.slug.toUpperCase()}
                  unitPrice={Number(item.product.price)}
                  quantity={item.quantity}
                  imageUrl={item.product.images[0]?.url}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4">
              <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6 flex flex-col shadow-sm">
                <h2 className="font-h2 text-h2 text-on-surface mb-6 border-b border-surface-variant pb-4">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-data-tabular text-data-tabular text-on-surface">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="font-data-tabular text-data-tabular text-on-surface">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Tax (8%)</span>
                    <span className="font-data-tabular text-data-tabular text-on-surface">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Voucher */}
                <div className="mb-6 bg-surface-bright p-4 rounded border border-surface-variant">
                  <label
                    className="block font-label-caps text-label-caps text-on-surface-variant mb-2"
                    htmlFor="voucher"
                  >
                    Voucher / Promo Code
                  </label>
                  <div className="flex">
                    <input
                      className="flex-1 bg-surface-container-lowest border border-outline-variant border-r-0 rounded-l px-3 py-2 font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder-outline-variant"
                      id="voucher"
                      placeholder="Enter code"
                      type="text"
                    />
                    <button className="bg-surface-container text-on-surface px-4 py-2 border border-outline-variant rounded-r font-label-caps text-label-caps hover:bg-surface-variant transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-surface-variant pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="font-h2 text-h2 text-on-surface">
                      Total
                    </span>
                    <span className="font-h1 text-h1 text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary text-on-primary py-3 rounded font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    lock
                  </span>
                  Proceed to Checkout
                </Link>
              </div>

              <Link
                href="/categories"
                className="text-center font-body-sm text-body-sm text-primary hover:underline"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
