import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

const orderListSelect = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  createdAt: true,
  items: { select: { id: true, quantity: true } },
} satisfies Prisma.OrderSelect;

type RawOrderListRow = Prisma.OrderGetPayload<{ select: typeof orderListSelect }>;

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: RawOrderListRow["status"];
  total: number;
  itemCount: number;
  createdAt: Date;
};

export type AdminOrderRow = OrderSummary & {
  customerName: string | null;
  customerEmail: string;
};

const adminOrderSelect = {
  id: true,
  orderNumber: true,
  status: true,
  total: true,
  createdAt: true,
  items: { select: { id: true, quantity: true } },
  user: { select: { name: true, email: true } },
} satisfies Prisma.OrderSelect;

export async function listAdminOrders(): Promise<AdminOrderRow[]> {
  const rows = await prisma.order.findMany({
    select: adminOrderSelect,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    total: Number(row.total),
    itemCount: row.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: row.createdAt,
    customerName: row.user.name,
    customerEmail: row.user.email,
  }));
}

export async function listUserOrders(userId: string): Promise<OrderSummary[]> {
  const rows = await prisma.order.findMany({
    where: { userId },
    select: orderListSelect,
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  return rows.map((row) => ({
    id: row.id,
    orderNumber: row.orderNumber,
    status: row.status,
    total: Number(row.total),
    itemCount: row.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: row.createdAt,
  }));
}
