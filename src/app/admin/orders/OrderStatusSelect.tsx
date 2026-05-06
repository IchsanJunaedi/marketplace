"use client";

// Manual enum definition to avoid importing the Prisma client (which may use node:module) into the browser.
// This matches the OrderStatus enum in the database.
enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED"
}

export default function OrderStatusSelect({ 
  orderId, 
  initialStatus,
  onUpdate
}: { 
  orderId: string; 
  initialStatus: string;
  onUpdate: (orderId: string, status: any) => Promise<any>;
}) {
  return (
    <select 
      name="status"
      defaultValue={initialStatus}
      className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wide border-none focus:ring-2 focus:ring-primary outline-none ${
        initialStatus === OrderStatus.PAID || initialStatus === OrderStatus.DELIVERED || initialStatus === OrderStatus.SHIPPED
          ? "bg-primary-container/20 text-primary" 
          : initialStatus === OrderStatus.CANCELLED || initialStatus === OrderStatus.EXPIRED
          ? "bg-error-container/50 text-error"
          : "bg-surface-container-high text-on-surface"
      }`}
      onChange={async (e) => {
        const newStatus = e.target.value as OrderStatus;
        await onUpdate(orderId, newStatus);
      }}
    >
      {Object.values(OrderStatus).map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
