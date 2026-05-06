import { prisma } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/client";
import { formatIDR } from "@/lib/utils";

export default async function AdminOverviewPage() {
  // Fetch real-time metrics
  const [
    totalRevenueResult,
    totalOrders,
    activeCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    // Total Revenue (sum of PAID/SHIPPED/DELIVERED orders)
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
        },
      },
    }),
    // Total Orders
    prisma.order.count(),
    // Active Customers
    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),
    // Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    // Low Stock Alerts (stock < 10)
    prisma.product.findMany({
      where: {
        stock: {
          lt: 10,
        },
        status: "ACTIVE",
      },
      take: 5,
      orderBy: {
        stock: "asc",
      },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.total?.toNumber() || 0;

  return (
    <>
      {/* Page Header */}
      <div className="mb-lg flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight">Overview</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time metrics and system alerts.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded-DEFAULT hover:bg-surface-container-low flex items-center">
            <span className="material-symbols-outlined mr-2 text-[18px]">calendar_today</span>
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-DEFAULT hover:bg-surface-tint flex items-center transition-colors">
            <span className="material-symbols-outlined mr-2 text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        {/* Total Revenue */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/10 rounded-DEFAULT">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-[12px] font-bold bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              +0%
            </span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Revenue</p>
            <h3 className="font-h2 text-h2 text-on-surface mt-1">{formatIDR(totalRevenue)}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container/10 rounded-DEFAULT">
              <span className="material-symbols-outlined text-secondary-container">shopping_bag</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-[12px] font-bold bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              +0%
            </span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Orders</p>
            <h3 className="font-h2 text-h2 text-on-surface mt-1">{totalOrders.toLocaleString()}</h3>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/10 rounded-DEFAULT">
              <span className="material-symbols-outlined text-tertiary-container">group</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-[12px] font-bold bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_flat</span>
              0.0%
            </span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Active Customers</p>
            <h3 className="font-h2 text-h2 text-on-surface mt-1">{activeCustomers.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-h3 text-h3 text-on-surface">Recent Orders</h3>
            <a className="font-label-md text-label-md text-secondary hover:text-secondary-container transition-colors" href="/admin/orders">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">
                  <th className="px-lg py-3 font-semibold">Order ID</th>
                  <th className="px-lg py-3 font-semibold">Customer</th>
                  <th className="px-lg py-3 font-semibold">Date</th>
                  <th className="px-lg py-3 font-semibold">Amount</th>
                  <th className="px-lg py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-lg py-8 text-center text-on-surface-variant italic">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-4 font-mono">#{order.orderNumber}</td>
                      <td className="px-lg py-4">{order.user.name || "Guest"}</td>
                      <td className="px-lg py-4 text-on-surface-variant">
                        {order.createdAt.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-lg py-4 font-semibold">{formatIDR(order.total.toNumber())}</td>
                      <td className="px-lg py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-DEFAULT text-[11px] font-bold uppercase tracking-wider ${
                          order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.SHIPPED
                            ? "bg-primary-container/20 text-primary" 
                            : order.status === OrderStatus.CANCELLED || order.status === OrderStatus.EXPIRED
                            ? "bg-error-container/50 text-error"
                            : "bg-surface-container-high text-on-surface"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col">
          <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-error-container/10">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-error mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h3 className="font-h3 text-h3 text-on-surface">Low Stock</h3>
            </div>
            <span className="bg-error text-on-error px-2 py-0.5 rounded-full font-label-sm text-[10px]">
              {lowStockProducts.length}
            </span>
          </div>
          <div className="flex-1 p-lg space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-on-surface-variant text-center py-4 italic">No low stock alerts.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-surface rounded-DEFAULT flex items-center justify-center border border-outline-variant">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">inventory_2</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface leading-tight">{product.name}</p>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">Slug: {product.slug}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-h3 text-h3 text-error leading-tight">{product.stock}</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">Left</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-outline-variant bg-surface-bright">
            <a 
              href="/admin/inventory"
              className="w-full block text-center py-2 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded-DEFAULT hover:bg-surface-container-low transition-colors"
            >
              Manage Inventory
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
