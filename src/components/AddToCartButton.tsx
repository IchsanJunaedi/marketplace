"use client";

import { useTransition } from "react";
import { addToCart } from "@/lib/cart";

interface Props {
  productId: string;
  label?: string;
  className?: string;
}

export default function AddToCartButton({
  productId,
  label = "Add",
  className,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await addToCart(productId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={
        className ??
        "border border-outline text-primary hover:bg-surface-container px-3 py-1.5 rounded font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-60"
      }
    >
      <span className="material-symbols-outlined text-[18px]">
        {isPending ? "hourglass_empty" : "add_shopping_cart"}
      </span>
      {isPending ? "Adding…" : label}
    </button>
  );
}
