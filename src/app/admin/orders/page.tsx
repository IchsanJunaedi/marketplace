import { prisma } from "@/lib/db";
import OrdersTable from "./OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    createdAt: o.createdAt.toLocaleDateString("id-ID"),
    customer: { name: o.user.name, email: o.user.email },
    status: o.status,
    total: o.total.toNumber(),
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-h2 text-h2 text-on-surface">Order Management</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manage, filter, and process enterprise orders.
          </p>
        </div>
        <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span> Export
        </button>
      </div>

      <OrdersTable orders={serialized} />
    </>
  );
}
