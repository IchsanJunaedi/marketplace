import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatIDR } from "@/lib/utils";
import { updateOrderStatus } from "@/lib/actions/orders";
import OrderStatusSelect from "../OrderStatusSelect";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      address: true,
      items: {
        include: {
          product: { include: { images: { take: 1, orderBy: { position: "asc" } } } },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Orders
          </Link>
          <h1 className="font-h1 text-h1 text-on-surface">Order #{order.orderNumber}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Placed {order.createdAt.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="mt-8">
          <OrderStatusSelect orderId={order.id} initialStatus={order.status} onUpdate={updateOrderStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Items */}
        <div className="md:col-span-2 space-y-lg">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <h2 className="font-h2 text-h2 text-on-surface mb-md pb-sm border-b border-outline-variant">Items</h2>
            <div className="space-y-md">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-md">
                  <div className="w-16 h-16 bg-surface-container rounded overflow-hidden flex-shrink-0">
                    {item.product?.images[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-body-md text-body-md font-medium text-on-surface">{item.productName}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.quantity} × {formatIDR(item.unitPrice.toNumber())}
                    </p>
                  </div>
                  <div className="font-body-md text-body-md text-on-surface font-semibold">
                    {formatIDR(item.quantity * item.unitPrice.toNumber())}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <h2 className="font-h2 text-h2 text-on-surface mb-md pb-sm border-b border-outline-variant">Customer</h2>
            <p className="font-body-md text-body-md font-medium text-on-surface">{order.user.name || "Guest"}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{order.user.email}</p>
            {order.user.phone && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">{order.user.phone}</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-lg">
          {/* Summary */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <h2 className="font-h2 text-h2 text-on-surface mb-md pb-sm border-b border-outline-variant">Summary</h2>
            <div className="space-y-xs mb-md">
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="text-on-surface">{formatIDR(order.subtotal.toNumber())}</span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface">{formatIDR(order.shippingCost.toNumber())}</span>
              </div>
              {order.discount.toNumber() > 0 && (
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Discount</span>
                  <span className="text-error">−{formatIDR(order.discount.toNumber())}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-sm border-t border-outline-variant">
              <span className="font-body-md font-bold text-on-surface">Total</span>
              <span className="font-body-md font-bold text-primary">{formatIDR(order.total.toNumber())}</span>
            </div>
          </div>

          {/* Shipping */}
          {order.address && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <h2 className="font-h2 text-h2 text-on-surface mb-md pb-sm border-b border-outline-variant">Ship To</h2>
              <p className="font-body-md text-body-md font-medium text-on-surface">{order.address.recipient}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{order.address.phone}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
                {order.address.street}, {order.address.city}, {order.address.province}{" "}
                {order.address.postalCode}
              </p>
              {order.shippingCourier && (
                <div className="mt-sm pt-sm border-t border-outline-variant">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Courier</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium uppercase">
                    {order.shippingCourier} – {order.shippingService}
                  </p>
                </div>
              )}
              {order.trackingNumber && (
                <div className="mt-sm pt-sm border-t border-outline-variant">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Tracking</p>
                  <p className="font-mono font-body-sm text-body-sm text-on-surface">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
