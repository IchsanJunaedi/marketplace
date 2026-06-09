"use client";

import { useState } from "react";
import { OrderStatus } from "@/generated/prisma/enums";

const POSITIVE = new Set<string>([OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED]);
const NEGATIVE = new Set<string>([OrderStatus.CANCELLED, OrderStatus.EXPIRED]);

function statusClass(status: string) {
  if (POSITIVE.has(status as OrderStatus)) return "bg-primary-container/20 text-primary";
  if (NEGATIVE.has(status as OrderStatus)) return "bg-error-container/50 text-error";
  return "bg-surface-container-high text-on-surface";
}

export default function OrderStatusSelect({
  orderId,
  initialStatus,
  onUpdate,
}: {
  orderId: string;
  initialStatus: string;
  onUpdate: (orderId: string, status: OrderStatus) => Promise<unknown>;
}) {
  const [status, setStatus] = useState(initialStatus);

  return (
    <select
      name="status"
      value={status}
      className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide border-none focus:ring-2 focus:ring-primary outline-none ${statusClass(status)}`}
      onChange={async (e) => {
        const next = e.target.value as OrderStatus;
        setStatus(next);
        await onUpdate(orderId, next);
      }}
    >
      {Object.values(OrderStatus).map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
