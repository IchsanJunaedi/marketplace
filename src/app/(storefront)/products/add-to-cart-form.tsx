"use client";

import { useState, useTransition } from "react";

import { addToCartAction } from "@/app/(storefront)/cart/actions";

export function AddToCartForm({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const disabled = stock < 1;

  const submit = (redirectTo: string) => {
    const fd = new FormData();
    fd.set("productId", productId);
    fd.set("quantity", String(Math.min(Math.max(qty, 1), Math.max(stock, 1))));
    fd.set("redirectTo", redirectTo);
    startTransition(() => {
      void addToCartAction(fd);
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-4">
        <label className="font-data-tabular text-data-tabular text-on-surface w-16">Qty</label>
        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden h-10 w-32">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={pending || disabled || qty <= 1}
            className="w-10 h-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <input
            type="number"
            min={1}
            max={Math.max(stock, 1)}
            value={qty}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) setQty(Math.min(Math.max(1, Math.floor(v)), Math.max(stock, 1)));
            }}
            disabled={pending || disabled}
            className="w-full h-full text-center border-none bg-surface-container-lowest font-data-tabular text-data-tabular text-on-surface focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(Math.max(stock, 1), q + 1))}
            disabled={pending || disabled || qty >= stock}
            className="w-10 h-full flex items-center justify-center bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors disabled:opacity-50"
            aria-label="Increase quantity"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <button
          type="button"
          onClick={() => submit("/cart")}
          disabled={pending || disabled}
          className="w-full bg-primary text-on-primary font-body-md text-body-md font-medium h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {disabled ? "Out of Stock" : pending ? "Adding..." : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={() => submit("/checkout")}
          disabled={pending || disabled}
          className="w-full border border-outline text-on-surface font-body-md text-body-md font-medium h-12 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          Buy now
        </button>
      </div>
    </div>
  );
}
