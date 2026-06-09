import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { ProductStatus } from "@/generated/prisma/client";
import InventoryTable from "./InventoryTable";

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

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price.toNumber(),
    wholesalePrice: p.wholesalePrice?.toNumber() ?? null,
    stock: p.stock,
    status: p.status,
    category: p.category,
  }));

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
            <Link
              href="/admin/inventory/new"
              className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-surface-tint transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Product
            </Link>
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
        <InventoryTable products={serializedProducts} />
      </div>
    </div>
  );
}
