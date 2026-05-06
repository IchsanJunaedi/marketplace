import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "./actions";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-h2 text-h2 text-on-surface">Order Management</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage, filter, and process enterprise orders.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant italic">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface font-medium">#{order.orderNumber}</td>
                    <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                      {order.createdAt.toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-body-sm text-body-sm text-on-surface font-medium">{order.user.name || "Guest"}</div>
                      <div className="font-label-sm text-[11px] text-on-surface-variant">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <form action={async (formData) => {
                        "use server";
                        const status = formData.get("status") as OrderStatus;
                        await updateOrderStatus(order.id, status);
                      }}>
                        <select 
                          name="status"
                          defaultValue={order.status}
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide border-none focus:ring-2 focus:ring-primary outline-none ${
                            order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.SHIPPED
                              ? "bg-primary-container/20 text-primary" 
                              : order.status === OrderStatus.CANCELLED || order.status === OrderStatus.EXPIRED
                              ? "bg-error-container/50 text-error"
                              : "bg-surface-container-high text-on-surface"
                          }`}
                          onInput={(e) => e.currentTarget.form?.requestSubmit()}
                        >
                          {Object.values(OrderStatus).map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </form>
                    </td>
                    <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface font-medium text-right">
                      {formatIDR(order.total.toNumber())}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest hover:bg-surface text-secondary font-label-sm text-label-sm transition-colors">
                        <span className="material-symbols-outlined text-[16px]">visibility</span> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-bright">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {orders.length} entries</span>
        </div>
      </div>
    </>
  );
}
