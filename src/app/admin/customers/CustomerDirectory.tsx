"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";

const STATUS_BADGE: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700",
  PAID:            "bg-blue-50 text-blue-700",
  SHIPPED:         "bg-teal-50 text-teal-700",
  DELIVERED:       "bg-green-50 text-green-700",
  CANCELLED:       "bg-red-50 text-red-700",
  EXPIRED:         "bg-gray-100 text-gray-500",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending",
  PAID:            "Paid",
  SHIPPED:         "In Transit",
  DELIVERED:       "Delivered",
  CANCELLED:       "Cancelled",
  EXPIRED:         "Expired",
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
};

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpend: number;
  avgOrder: number;
  recentOrders: RecentOrder[];
};

export default function CustomerDirectory({ customers }: { customers: Customer[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg h-[calc(100vh-12rem)] min-h-[600px]">
      {/* Customer list */}
      <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="px-md py-sm border-b border-outline-variant bg-surface flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            <span className="font-label-md text-label-md text-on-surface">All Customers</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant z-10">
              <tr>
                <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
                <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Orders</th>
                <th className="py-sm px-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-on-surface-variant italic">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedId(customer.id === selectedId ? null : customer.id)}
                    className={`cursor-pointer transition-colors border-l-4 ${
                      customer.id === selectedId
                        ? "border-l-primary bg-primary-container/10"
                        : "border-l-transparent hover:bg-surface-container-low bg-surface-container-lowest"
                    }`}
                  >
                    <td className="py-sm px-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 flex items-center justify-center text-primary">
                          {customer.image ? (
                            <img alt={customer.name || "User"} className="w-full h-full object-cover" src={customer.image} />
                          ) : (
                            <span className="material-symbols-outlined">account_circle</span>
                          )}
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface">{customer.name || "No Name"}</div>
                          <div className="font-body-sm text-body-sm text-on-surface-variant">{customer.phone || "No Phone"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">{customer.email}</td>
                    <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">{customer.totalOrders}</td>
                    <td className="py-sm px-md font-body-sm text-body-sm text-on-surface">{customer.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-md py-sm border-t border-outline-variant bg-surface flex items-center justify-between">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {customers.length} entries</span>
        </div>
      </div>

      {/* Detail panel */}
      <div className="xl:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
        {selected ? (
          <>
            <div className="p-lg border-b border-outline-variant flex items-center gap-md">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center text-primary flex-shrink-0">
                {selected.image ? (
                  <img alt={selected.name || "User"} className="w-full h-full object-cover" src={selected.image} />
                ) : (
                  <span className="material-symbols-outlined text-[36px]">account_circle</span>
                )}
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">{selected.name || "No Name"}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{selected.email}</p>
              </div>
            </div>

            <div className="flex-1 p-lg space-y-md overflow-y-auto">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-sm">
                <div className="bg-surface-container-low rounded-lg p-sm">
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Total Spend</p>
                  <p className="font-h3 text-h3 text-primary mt-0.5">{formatIDR(selected.totalSpend)}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-sm">
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Avg Order</p>
                  <p className="font-h3 text-h3 text-on-surface mt-0.5">{formatIDR(selected.avgOrder)}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="pt-sm border-t border-outline-variant space-y-xs">
                {selected.phone && (
                  <div>
                    <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Phone</p>
                    <p className="font-body-sm text-body-sm text-on-surface">{selected.phone}</p>
                  </div>
                )}
                <div>
                  <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Member Since</p>
                  <p className="font-body-sm text-body-sm text-on-surface">{selected.createdAt}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="pt-sm border-t border-outline-variant">
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-sm">
                  Recent Orders ({selected.totalOrders} total)
                </p>
                {selected.recentOrders.length === 0 ? (
                  <p className="text-center text-on-surface-variant font-body-sm text-body-sm italic py-md">No orders yet.</p>
                ) : (
                  <div className="space-y-xs">
                    {selected.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between bg-surface-container-low rounded p-sm">
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface font-medium">#{order.orderNumber}</p>
                          <p className="font-body-sm text-[10px] text-on-surface-variant">{order.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-label-sm text-label-sm text-on-surface font-semibold">{formatIDR(order.total)}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${STATUS_BADGE[order.status] ?? "bg-surface-container text-on-surface"}`}>
                            {STATUS_LABEL[order.status] ?? order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-lg text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">person_search</span>
            <h3 className="font-h3 text-h3 text-on-surface">Select a Customer</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Click on a customer in the list to view their full profile and transaction history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
