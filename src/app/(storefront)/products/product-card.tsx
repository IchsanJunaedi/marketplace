/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import type { ProductListItem } from "@/lib/products";
import { ProductStatus } from "@/generated/prisma/client";

const PLACEHOLDER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJiKMniu0k7DHTnYurAWnrxEHhHQ6x3hjrQtrXnkDy_nqLTMVMNWkTmf7QT2b1TiGV4pb9xNK8cH8U6k6ixlb2_yw0BvKFAt0oIVgo3tyjbzkuS6YleqNfCZgAaZ0uiXGSOyOTYVSJjygeRndrBxVPEBG0FLuofbQDeu8Jy0ZNsqpOXedLns0k47WxspdcO1nl3as0LQLMWTvLgyMb9oK0s27lp3k8h49KiJ1D3WOQh9nX3_q13g9by1B-_8aqcfGOnwwvzbyRK4_F";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function ProductCard({ product }: { product: ProductListItem }) {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isNew = product.isNew;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-surface-container-lowest border border-surface-variant rounded-DEFAULT overflow-hidden flex flex-col group hover:border-outline transition-colors"
    >
      <div className="h-48 w-full bg-surface-container relative p-4 flex items-center justify-center">
        {isLowStock ? (
          <div className="absolute top-2 left-2 bg-error-container text-on-error-container border border-error-container px-1.5 py-0.5 rounded-DEFAULT font-label-caps text-label-caps uppercase">
            Low Stock
          </div>
        ) : isNew ? (
          <div className="absolute top-2 left-2 bg-surface-container-lowest text-primary border border-outline-variant px-1.5 py-0.5 rounded-DEFAULT font-label-caps text-label-caps uppercase">
            New
          </div>
        ) : null}
        {product.status === ProductStatus.DRAFT ? (
          <div className="absolute top-2 right-2 bg-surface-container text-on-surface-variant border border-outline-variant px-1.5 py-0.5 rounded-DEFAULT font-label-caps text-label-caps uppercase">
            Draft
          </div>
        ) : null}
        <img
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
          src={product.primaryImageUrl ?? PLACEHOLDER_IMAGE}
        />
      </div>
      <div className="p-4 flex flex-col flex-1 border-t border-surface-variant">
        <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">
          {product.category?.name ?? "General"}
        </div>
        <h4 className="font-body-md text-body-md font-medium text-on-background mb-1 leading-snug line-clamp-2">
          {product.name}
        </h4>
        <div className="flex items-center gap-1 mb-3">
          <span
            className="material-symbols-outlined text-[14px] text-tertiary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-data-tabular text-data-tabular text-on-surface">
            —
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">
            ({product.stock} in stock)
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.compareAt ? (
              <div className="font-body-sm text-body-sm text-on-surface-variant line-through">
                {fmt.format(product.compareAt)}
              </div>
            ) : null}
            <div className="font-h2 text-h2 text-on-background">
              {fmt.format(product.price)}
            </div>
          </div>
          <span className="border border-outline text-primary hover:bg-surface-container px-3 py-1.5 rounded-DEFAULT font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">
              add_shopping_cart
            </span>
            Add
          </span>
        </div>
      </div>
    </Link>
  );
}
