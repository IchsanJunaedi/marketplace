"use client";

import { useActionState } from "react";

import {
  placeOrderAction,
  type CheckoutFormState,
} from "@/app/(storefront)/checkout/actions";

const initialState: CheckoutFormState = {};

export function CheckoutForm({
  defaultName,
  hasItems,
}: {
  defaultName: string | null;
  hasItems: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    placeOrderAction,
    initialState,
  );
  const fe = state.fieldErrors ?? {};
  const [firstName, lastName] = (defaultName ?? "").split(/\s+/, 2);

  return (
    <form action={formAction} className="space-y-card-gap" noValidate>
      {state.error ? (
        <div className="bg-error-container text-on-error-container border border-error-container px-4 py-3 rounded font-body-sm text-body-sm">
          {state.error}
        </div>
      ) : null}

      {/*  Step 1: Shipping Address  */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-container-padding">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-h2 text-h2">1</div>
          <h2 className="font-h2 text-h2 text-on-surface">Shipping Address</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div className="col-span-1">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">First Name</label>
            <input
              name="recipientFirstName"
              defaultValue={firstName ?? ""}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="text"
            />
            {fe.recipientFirstName ? (
              <p className="mt-1 text-error font-body-sm text-body-sm">{fe.recipientFirstName[0]}</p>
            ) : null}
          </div>
          <div className="col-span-1">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Last Name</label>
            <input
              name="recipientLastName"
              defaultValue={lastName ?? ""}
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="text"
            />
            {fe.recipientLastName ? (
              <p className="mt-1 text-error font-body-sm text-body-sm">{fe.recipientLastName[0]}</p>
            ) : null}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Address Line 1</label>
            <input
              name="street"
              required
              placeholder="123 Enterprise Parkway, Suite 400"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="text"
            />
            {fe.street ? <p className="mt-1 text-error font-body-sm text-body-sm">{fe.street[0]}</p> : null}
          </div>
          <div className="col-span-1">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">City</label>
            <input
              name="city"
              required
              placeholder="Tech Hub"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="text"
            />
            {fe.city ? <p className="mt-1 text-error font-body-sm text-body-sm">{fe.city[0]}</p> : null}
          </div>
          <div className="col-span-1">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Postal Code</label>
            <input
              name="postalCode"
              required
              placeholder="90210"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="text"
            />
            {fe.postalCode ? <p className="mt-1 text-error font-body-sm text-body-sm">{fe.postalCode[0]}</p> : null}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Phone (optional)</label>
            <input
              name="phone"
              placeholder="+62 812-3456-7890"
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
              type="tel"
            />
          </div>
        </div>
      </div>

      {/*  Step 2: Shipping Method  */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-container-padding">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-h2 text-h2">2</div>
          <h2 className="font-h2 text-h2 text-on-surface">Shipping Method</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-start gap-4 p-4 rounded border-2 border-primary bg-primary-fixed cursor-pointer transition-colors has-[:checked]:border-primary">
            <div className="flex-shrink-0 mt-0.5">
              <input
                defaultChecked
                name="shippingService"
                value="JNE_REG"
                type="radio"
                className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span className="font-h2 text-body-md font-semibold text-on-background">Raja Ongkir - JNE REG</span>
                <span className="font-data-tabular text-data-tabular text-on-background">$15.00</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Estimated delivery: 2-3 business days</p>
            </div>
          </label>
          <label className="flex items-start gap-4 p-4 rounded border border-outline-variant hover:border-outline cursor-pointer transition-colors">
            <div className="flex-shrink-0 mt-0.5">
              <input
                name="shippingService"
                value="JNE_YES"
                type="radio"
                className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span className="font-h2 text-body-md font-semibold text-on-background">Raja Ongkir - JNE YES</span>
                <span className="font-data-tabular text-data-tabular text-on-background">$25.00</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Estimated delivery: 1 business day (Next Day)</p>
            </div>
          </label>
        </div>
      </div>

      {/*  Step 3: Payment Method  */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-container-padding">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-h2 text-h2">3</div>
          <h2 className="font-h2 text-h2 text-on-surface">Payment</h2>
        </div>
        <div className="bg-surface-container-low p-4 rounded border border-surface-variant">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
            Pembayaran akan ditangani secara manual untuk sementara (offline). Setelah order
            di-place, admin akan menghubungi Anda dengan instruksi transfer. Integrasi gateway
            (Midtrans) menyusul di milestone berikutnya.
          </p>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="font-label-caps text-label-caps uppercase">Secure Transaction</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || !hasItems}
        className="w-full bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-body-md text-body-md font-medium py-3 rounded transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">lock</span>
        {pending ? "Placing order..." : hasItems ? "Place Order" : "Cart is empty"}
      </button>
      <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-2">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
