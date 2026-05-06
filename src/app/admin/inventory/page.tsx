import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { ProductStatus } from "@/generated/prisma/client";

export default async function AdminInventoryPage() {
  const [products, categories, stats] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany(),
    prisma.product.aggregate({
      _count: { id: true },
      _sum: { price: true }, // Simple estimation
    }),
  ]);

  const lowStockCount = products.filter(p => p.stock < 10).length;
  const activeCategoriesCount = categories.length;
  const totalPrice = stats._sum.price?.toNumber() || 0;

  return (
    <div className="max-w-[1280px] mx-auto space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col gap-md mb-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-h1 text-h1 text-on-surface">Inventory Management</h1>
          <div className="flex gap-sm">
            <button className="px-md py-sm bg-surface-container-lowest border border-outline-variant text-secondary font-label-md text-label-md rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">download</span> Export
            </button>
            <button className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-surface-tint transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">add</span> Add Product
            </button>
          </div>
        </div>
        <div className="flex border-b border-outline-variant">
          <button className="px-md py-sm border-b-[2px] border-primary text-primary font-label-md text-label-md">Products</button>
          <button className="px-md py-sm border-b-[2px] border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">Stock Audit Log</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">inventory</span> Total Products
          </span>
          <div className="font-h2 text-h2 text-on-surface">{stats._count.id}</div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px] text-error">warning</span> Low Stock Alerts
          </span>
          <div className="font-h2 text-h2 text-on-surface">{lowStockCount}</div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">category</span> Active Categories
          </span>
          <div className="font-h2 text-h2 text-on-surface">{activeCategoriesCount}</div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex flex-col gap-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">payments</span> Est. Stock Value
          </span>
          <div className="font-h2 text-h2 text-on-surface">{formatIDR(totalPrice)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col overflow-hidden">
        <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <div className="flex items-center gap-sm w-full max-w-[28rem]">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input className="w-full pl-9 pr-4 py-xs bg-surface-container-lowest border border-outline-variant rounded text-body-sm text-on-surface focus:outline-none focus:border-secondary h-[32px]" placeholder="Search..." type="text" />
            </div>
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md">
                    <div className="flex items-center gap-md">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface">{product.name}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{product.category?.name || "Uncategorized"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-md font-body-sm text-body-sm text-on-surface">{formatIDR(product.price.toNumber())}</td>
                  <td className="p-md font-body-sm text-body-sm text-on-surface-variant">
                    {product.wholesalePrice ? formatIDR(product.wholesalePrice.toNumber()) : "-"}
                  </td>
                  <td className={`p-md font-body-sm text-body-sm text-right ${product.stock < 10 ? "text-error font-bold" : "text-on-surface"}`}>
                    {product.stock}
                  </td>
                  <td className="p-md text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded font-label-sm text-label-sm ${
                      product.status === ProductStatus.ACTIVE ? "bg-primary-container/20 text-primary" : "bg-surface-variant text-on-surface-variant"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-md text-right">
                    <div className="flex items-center justify-end gap-sm">
                      <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button className="p-xs text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
