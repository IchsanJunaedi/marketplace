import { prisma } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/client";
import { formatIDR } from "@/lib/utils";
import { SalesChart, StatusChart } from "./Charts";

export default async function AdminReportsPage() {
  // 1. Fetch real sales data for the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  // Aggregate by date
  const salesByDate: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    salesByDate[d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })] = 0;
  }

  orders.forEach((o) => {
    const key = o.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (salesByDate[key] !== undefined) {
      salesByDate[key] += o.total.toNumber();
    }
  });

  const salesData = Object.entries(salesByDate)
    .map(([name, total]) => ({ name, total }))
    .reverse();

  // 2. Fetch order status distribution
  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const orderStatusData = statusCounts.map((s) => ({
    name: s.status,
    count: s._count.id,
  }));

  // 3. Operational Metrics
  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.total.toNumber(), 0) / orders.length
    : 0;

  const [activeProducts, inStockProducts, totalReviews] = await Promise.all([
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { status: "ACTIVE", stock: { gt: 0 } } }),
    prisma.review.count(),
  ]);

  const inventoryAccuracy =
    activeProducts > 0 ? Math.round((inStockProducts / activeProducts) * 1000) / 10 : 100;

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-h1 text-h1 text-on-surface">Enterprise Precision</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Operational accuracy and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Sales Trend */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h3 className="font-h3 text-h3 text-on-surface mb-6">Revenue Trend (Last 7 Days)</h3>
          <SalesChart salesData={salesData} />
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h3 className="font-h3 text-h3 text-on-surface mb-6">Order Status Distribution</h3>
          <StatusChart orderStatusData={orderStatusData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
          <p className="font-label-md text-label-md text-on-surface-variant">Avg. Order Value</p>
          <h3 className="font-h2 text-h2 text-on-surface mt-1">{formatIDR(avgOrderValue)}</h3>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
          <p className="font-label-md text-label-md text-on-surface-variant">In-Stock Rate</p>
          <h3 className="font-h2 text-h2 text-on-surface mt-1">{inventoryAccuracy}%</h3>
          <p className="text-[11px] text-primary font-bold mt-1">
            {inStockProducts}/{activeProducts} ACTIVE
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Reviews</p>
          <h3 className="font-h2 text-h2 text-on-surface mt-1">{totalReviews.toLocaleString()}</h3>
          <p className="text-[11px] text-on-surface-variant font-bold mt-1">ALL TIME</p>
        </div>
      </div>
    </div>
  );
}
