"use client";

import { useState } from "react";
import Link from "next/link";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  weightGram: number;
}

interface Address {
  id: string;
  recipient: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface CheckoutClientProps {
  cartItems: CartItem[];
  subtotal: number;
  addresses: Address[];
  userEmail: string;
  userName: string;
  userPhone: string;
  midtransClientKey: string;
}

const SHIPPING_OPTIONS = [
  { courier: "JNE", service: "REG", label: "JNE Regular", cost: 15000, etd: "2-3 business days" },
  { courier: "JNE", service: "YES", label: "JNE YES (Next Day)", cost: 25000, etd: "1 business day" },
  { courier: "TIKI", service: "REG", label: "TIKI Regular", cost: 13000, etd: "3-5 business days" },
];

export default function CheckoutClient({
  cartItems,
  subtotal,
  addresses,
  userEmail,
  userName,
  userPhone,
  midtransClientKey,
}: CheckoutClientProps) {
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id ?? "new");
  const [shippingIdx, setShippingIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New address form state
  const [newRecipient, setNewRecipient] = useState(userName);
  const [newPhone, setNewPhone] = useState(userPhone);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");

  const selected = SHIPPING_OPTIONS[shippingIdx];
  const shippingCost = selected.cost;
  const total = subtotal + shippingCost;

  async function handlePlaceOrder() {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const body: Record<string, unknown> = {
        shippingCourier: selected.courier,
        shippingService: selected.service,
        shippingCost,
      };

      if (selectedAddressId !== "new") {
        body.addressId = selectedAddressId;
      } else {
        const saveRes = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: newRecipient,
            phone: newPhone,
            street: newStreet,
            city: newCity,
            province: newProvince,
            postalCode: newPostalCode,
          }),
        });
        if (!saveRes.ok) {
          const err = await saveRes.json();
          throw new Error(err.message ?? "Failed to save address");
        }
        const saved = await saveRes.json();
        body.addressId = saved.id;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Checkout failed");
      }

      const { token } = await res.json();

      (window as any).snap.pay(token, {
        onSuccess: () => { window.location.href = "/account?tab=orders"; },
        onPending: () => { window.location.href = "/account?tab=orders"; },
        onError: () => { setErrorMsg("Payment failed. Please try again."); setIsLoading(false); },
        onClose: () => { setIsLoading(false); },
      });
    } catch (err: any) {
      setErrorMsg(err.message ?? "Something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <>
      <script
        src={`https://app.sandbox.midtrans.com/snap/snap.js`}
        data-client-key={midtransClientKey}
        async
      />

      <div className="bg-surface-container-low text-on-surface antialiased font-body-md min-h-screen flex flex-col">
        <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black text-on-background tracking-tight">
              EnterpriseStore
            </Link>
            <div className="flex items-center gap-2 text-secondary font-body-sm">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Secure Checkout</span>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 py-8">
          <div className="mb-6">
            <h1 className="font-h1 text-h1 text-on-background">Checkout</h1>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded bg-error-container text-on-error-container border border-error/20 font-body-sm text-body-sm">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Address */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-sm">1</div>
                  <h2 className="font-h2 text-h2 text-on-surface">Shipping Address</h2>
                </div>

                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 p-4 rounded border-2 cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? "border-primary bg-primary-fixed"
                          : "border-outline-variant hover:border-outline"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1 w-4 h-4 text-primary"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-background">
                          {addr.recipient}
                          {addr.isDefault && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary text-on-primary rounded uppercase">Default</span>
                          )}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{addr.phone}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}

                  <label
                    className={`flex items-center gap-4 p-4 rounded border-2 cursor-pointer transition-colors ${
                      selectedAddressId === "new"
                        ? "border-primary bg-primary-fixed"
                        : "border-outline-variant hover:border-outline"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="w-4 h-4 text-primary"
                      checked={selectedAddressId === "new"}
                      onChange={() => setSelectedAddressId("new")}
                    />
                    <span className="font-body-md text-body-md text-on-surface">+ Use a new address</span>
                  </label>
                </div>

                {selectedAddressId === "new" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4 pt-4 border-t border-surface-variant">
                    <div className="col-span-1">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Recipient Name</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="text"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Phone Number</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Street Address</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="text"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        placeholder="Jl. Example No. 123"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">City</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Jakarta"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Province</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="text"
                        value={newProvince}
                        onChange={(e) => setNewProvince(e.target.value)}
                        placeholder="DKI Jakarta"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1 font-medium">Postal Code</label>
                      <input
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                        type="text"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-outline-variant text-outline font-bold text-sm">2</div>
                  <h2 className="font-h2 text-h2 text-on-surface">Shipping Method</h2>
                </div>
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-4 p-4 rounded border-2 cursor-pointer transition-colors ${
                        shippingIdx === idx
                          ? "border-primary bg-primary-fixed"
                          : "border-outline-variant hover:border-outline"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="radio"
                          name="shipping"
                          className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
                          checked={shippingIdx === idx}
                          onChange={() => setShippingIdx(idx)}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-body-md font-semibold text-on-background">{opt.label}</span>
                          <span className="font-data-tabular text-data-tabular text-on-background">
                            Rp {opt.cost.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Estimated delivery: {opt.etd}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-variant">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-outline-variant text-outline font-bold text-sm">3</div>
                  <h2 className="font-h2 text-h2 text-on-surface">Payment</h2>
                </div>
                <div className="bg-surface-container-low p-4 rounded border border-surface-variant">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                    <span className="font-body-md text-body-md font-semibold text-on-background">Midtrans Payment Gateway</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    You will be redirected to the secure Midtrans payment portal.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 sticky top-24">
                <h2 className="font-h2 text-h2 text-on-surface mb-6 pb-4 border-b border-surface-variant">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-surface-variant max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-body-sm text-body-sm text-on-background font-medium line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-data-tabular text-data-tabular text-on-background text-right text-sm">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-data-tabular text-data-tabular text-on-background">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                    <span>Shipping ({selected.label})</span>
                    <span className="font-data-tabular text-data-tabular text-on-background">
                      Rp {shippingCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 pt-4 border-t border-surface-variant">
                  <span className="font-h2 text-h2 text-on-background">Total</span>
                  <span className="font-h1 text-h1 text-primary font-bold">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-60 disabled:cursor-not-allowed text-on-primary font-body-md text-body-md font-medium py-3 rounded transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? "Processing..." : "Place Order via Midtrans"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}