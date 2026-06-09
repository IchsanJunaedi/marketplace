"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { formatIDR } from "@/lib/utils";
import { deleteProduct } from "./actions";

type Product = {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number | null;
  stock: number;
  status: string; // ACTIVE | DRAFT | ARCHIVED
  category: { name: string } | null;
};

function stockBadge(stock: number) {
  if (stock === 0) return { label: "Out of Stock", cls: "bg-red-50 text-red-700 border border-red-200" };
  if (stock < 10)  return { label: "Low Stock",    cls: "bg-amber-50 text-amber-700 border border-amber-200" };
  return               { label: "In Stock",      cls: "bg-green-50 text-green-700 border border-green-200" };
}

const PRODUCT_STATUS_CLS: Record<string, string> = {
  ACTIVE:   "bg-primary-container/20 text-primary",
  DRAFT:    "bg-surface-variant text-on-surface-variant",
  ARCHIVED: "bg-surface-container text-on-surface-variant",
};

export default function InventoryTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.category?.name ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  function handleDelete(id: string) {
    if (!confirm("Hapus produk ini? Tidak bisa dibatalkan.")) return;
    startTransition(() => deleteProduct(id));
  }

  return (
    <>
      <div className="p-md border-b border-outline-variant flex items-center bg-surface-bright">
        <div className="relative w-full max-w-[28rem]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-4 py-xs bg-surface-container-lowest border border-outline-variant rounded text-body-sm text-on-surface focus:outline-none focus:border-secondary h-[32px]"
            placeholder="Search products..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-bright">
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold">Product</th>
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold">Price</th>
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold">Wholesale</th>
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">Stock</th>
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold text-center">Status</th>
              <th className="p-md font-label-sm text-label-sm text-on-surface-variant font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-md text-center text-on-surface-variant italic">
                  {search ? "No products match your search." : "No products found."}
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-md text-label-md text-on-surface">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {product.category?.name || "Uncategorized"}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${PRODUCT_STATUS_CLS[product.status] ?? "bg-surface-variant text-on-surface-variant"}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-md font-body-sm text-body-sm text-on-surface">{formatIDR(product.price)}</td>
                  <td className="p-md font-body-sm text-body-sm text-on-surface-variant">
                    {product.wholesalePrice != null ? formatIDR(product.wholesalePrice) : "-"}
                  </td>
                  <td
                    className={`p-md font-body-sm text-body-sm text-right font-medium ${
                      product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-amber-600" : "text-on-surface"
                    }`}
                  >
                    {product.stock}
                  </td>
                  <td className="p-md text-center">
                    {(() => { const b = stockBadge(product.stock); return (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${b.cls}`}>
                        {b.label}
                      </span>
                    ); })()}
                  </td>
                  <td className="p-md text-right">
                    <div className="flex items-center justify-end gap-sm">
                      <Link
                        href={`/admin/inventory/${product.id}`}
                        className="p-xs text-on-surface-variant hover:text-secondary transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        type="button"
                        disabled={pending}
                        className="p-xs text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                        title="Delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
