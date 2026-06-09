import { prisma } from "@/lib/db";
import CustomerDirectory from "./CustomerDirectory";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: {
        select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = customers.map((c) => {
    const totalSpend = c.orders.reduce((sum, o) => sum + o.total.toNumber(), 0);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      image: c.image,
      createdAt: c.createdAt.toLocaleDateString("id-ID"),
      totalOrders: c.orders.length,
      totalSpend,
      avgOrder: c.orders.length > 0 ? totalSpend / c.orders.length : 0,
      recentOrders: c.orders.slice(0, 4).map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total.toNumber(),
        status: o.status,
        createdAt: o.createdAt.toLocaleDateString("id-ID"),
      })),
    };
  });

  return (
    <>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Customer Database</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Manage your enterprise clientele and view transaction histories.
          </p>
        </div>
      </div>

      <CustomerDirectory customers={serialized} />
    </>
  );
}
