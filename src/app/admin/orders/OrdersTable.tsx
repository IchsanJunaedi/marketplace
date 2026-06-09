"use client";

import Link from "next/link";
import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";
import { updateOrderStatus } from "@/lib/actions/orders";
import { OrderStatus } from "@/generated/prisma/enums";

const STATUS_BADGE: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border border-amber-200",
  PAID:            "bg-blue-50 text-blue-700 border border-blue-200",
  SHIPPED:         "bg-teal-50 text-teal-700 border border-teal-200",
  DELIVERED:       "bg-green-50 text-green-700 border border-green-200",
  CANCELLED:       "bg-red-50 text-red-700 border border-red-200",
  EXPIRED:         "bg-gray-100 text-gray-500 border border-gray-200",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID:            "Paid",
  SHIPPED:         "In Transit",
  DELIVERED:       "Delivered",
  CANCELLED:       "Cancelled",
  EXPIRED:         "Expired",
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: { name: string | null; email: string | null };
  status: string;
  total: number;
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      (o.customer.name ?? "").toLowerCase().includes(q) ||
      (o.customer.email ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
      {/* Filter bar */}
      <div className="px-4 py-3 border-b border-outline-variant bg-surface-bright flex flex-wrap gap-3 items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-secondary h-9"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
          ))}
        </select>

        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
            search
          </span>
          <input
            type="text"
            placeholder="Customer name or order #"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-secondary h-9"
          />
        </div>

        {(filterStatus !== "ALL" || search) && (
          <button
            onClick={() => { setFilterStatus("ALL"); setSearch(""); }}
            className="px-3 py-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors"
          >
            Clear
          </button>
        )}

        <span className="ml-auto font-body-sm text-body-sm text-on-surface-variant">
          {filtered.length} of {orders.length} entries
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-bright">
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold">Order #</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold">Date</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold">Customer</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Amount</th>
              <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant italic">
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface font-medium">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-sm text-body-sm text-on-surface font-medium">
                      {order.customer.name || "Guest"}
                    </div>
                    <div className="font-label-sm text-[11px] text-on-surface-variant">
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${STATUS_BADGE[order.status] ?? "bg-surface-container text-on-surface border border-outline-variant"}`}
                      >
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                      <OrderStatusSelect
                        orderId={order.id}
                        initialStatus={order.status}
                        onUpdate={updateOrderStatus}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface font-medium text-right">
                    {formatIDR(order.total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest hover:bg-surface text-secondary font-label-sm text-label-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span> Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
