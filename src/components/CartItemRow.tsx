"use client";

/* eslint-disable @next/next/no-img-element */
import { useTransition } from "react";
import { updateCartItem, removeCartItem } from "@/lib/cart";

interface CartItemRowProps {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export default function CartItemRow({
  id,
  name,
  sku,
  unitPrice,
  quantity,
  imageUrl,
}: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();

  function changeQty(newQty: number) {
    startTransition(async () => {
      await updateCartItem(id, newQty);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCartItem(id);
    });
  }

  const lineTotal = (unitPrice * quantity).toFixed(2);

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-surface-variant hover:bg-surface-bright transition-colors ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <img
          alt={name}
          className="w-16 h-16 object-cover rounded border border-surface-variant bg-surface-container"
          src={imageUrl ?? "https://placehold.co/64x64?text=No+Image"}
        />
        <div>
          <div className="font-h2 text-h2 text-on-surface mb-1">{name}</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            SKU: {sku}
          </div>
          <div className="font-data-tabular text-data-tabular text-primary mt-1">
            ${unitPrice.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
        {/* Qty stepper */}
        <div className="flex items-center border border-outline-variant rounded h-9 bg-surface-container-lowest">
          <button
            onClick={() => changeQty(quantity - 1)}
            className="w-9 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-l"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <input
            type="text"
            readOnly
            value={quantity}
            className="w-12 h-full text-center border-x border-outline-variant font-data-tabular text-data-tabular bg-surface-container-lowest p-0 focus:outline-none"
          />
          <button
            onClick={() => changeQty(quantity + 1)}
            className="w-9 h-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors rounded-r"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {/* Line total */}
        <div className="w-24 text-right font-data-tabular text-data-tabular text-on-surface font-semibold">
          ${lineTotal}
        </div>

        {/* Delete */}
        <button
          onClick={handleRemove}
          title="Remove item"
          className="text-on-surface-variant hover:text-error transition-colors p-2"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
}
