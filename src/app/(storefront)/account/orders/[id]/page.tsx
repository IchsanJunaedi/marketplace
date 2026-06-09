import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { formatIDR } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } },
      },
      address: true,
    },
  });

  if (!order) {
    redirect("/account?tab=orders");
  }

  // Build tracking steps based on current status
  const STATUS_ORDER = ["PENDING_PAYMENT", "PAID", "SHIPPED", "DELIVERED"];
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED" || order.status === "EXPIRED";

  const steps = [
    { label: "Order Placed",        sub: "Order received by the store.",           icon: "shopping_bag",     statusKey: "PENDING_PAYMENT" },
    { label: "Payment Confirmed",   sub: "Payment processed successfully.",         icon: "payments",         statusKey: "PAID"            },
    { label: "Processing",          sub: "Order packed and ready for carrier pickup.", icon: "inventory_2",   statusKey: "SHIPPED"         },
    { label: "In Transit",          sub: "Package is out for delivery.",            icon: "local_shipping",   statusKey: "SHIPPED"         },
    { label: "Delivered",           sub: "Package delivered successfully.",         icon: "check_circle",     statusKey: "DELIVERED"       },
  ];

  // Which step index is "reached"
  const stepReached = (statusKey: string) => {
    const idx = STATUS_ORDER.indexOf(statusKey);
    return !isCancelled && currentIdx >= idx;
  };

  const STATUS_STYLE: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-50 text-amber-700 border border-amber-200",
    PAID:            "bg-blue-50 text-blue-700 border border-blue-200",
    SHIPPED:         "bg-teal-50 text-teal-700 border border-teal-200",
    DELIVERED:       "bg-green-50 text-green-700 border border-green-200",
    CANCELLED:       "bg-red-50 text-red-700 border border-red-200",
    EXPIRED:         "bg-gray-100 text-gray-500 border border-gray-200",
  };

  const STATUS_LABEL: Record<string, string> = {
    PENDING_PAYMENT: "Pending Payment",
    PAID:            "Paid",
    SHIPPED:         "In Transit",
    DELIVERED:       "Delivered",
    CANCELLED:       "Cancelled",
    EXPIRED:         "Expired",
  };

  const badgeStyle = STATUS_STYLE[order.status] ?? "bg-surface-container text-on-surface border border-outline-variant";
  const badgeLabel = STATUS_LABEL[order.status] ?? order.status;

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen">
      <Navbar active="Account" />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account?tab=orders"
            className="text-primary hover:underline flex items-center gap-2 mb-4 font-body-sm text-body-sm w-fit"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to My Orders
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-h1 text-h1 text-on-background">Order #{order.orderNumber}</h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Placed on {order.createdAt.toLocaleString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap ${badgeStyle}`}>
                {badgeLabel}
              </span>
              <button
                disabled
                title="Coming soon"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-outline-variant rounded text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download Invoice
              </button>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded font-body-sm text-body-sm hover:bg-surface-tint transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                Reorder Items
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col: Tracking + Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Status */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-6">Tracking Status</h2>

              {isCancelled ? (
                <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <span className="material-symbols-outlined text-red-500 text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    cancel
                  </span>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-red-700">Order {order.status.toLowerCase()}</p>
                    <p className="font-body-sm text-body-sm text-red-500 mt-0.5">This order has been cancelled or expired.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {steps.map((step, i) => {
                    const reached = stepReached(step.statusKey);
                    const isLast = i === steps.length - 1;
                    return (
                      <div key={i} className="flex gap-4">
                        {/* Icon + line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              reached
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container border-2 border-outline-variant text-on-surface-variant"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              style={reached ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              {step.icon}
                            </span>
                          </div>
                          {!isLast && (
                            <div
                              className={`w-0.5 h-10 mt-1 ${reached ? "bg-primary" : "bg-outline-variant"}`}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                          <p
                            className={`font-body-md text-body-md font-semibold ${
                              reached ? "text-on-surface" : "text-on-surface-variant"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            {step.sub}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">
                Items Ordered
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
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
                      <h3 className="font-body-md text-body-md font-medium text-on-surface">
                        {item.productName}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Qty: {item.quantity} · {formatIDR(item.unitPrice.toNumber())} / item
                      </p>
                    </div>
                    <div className="font-body-md text-body-md text-on-background font-semibold whitespace-nowrap">
                      {formatIDR(item.quantity * item.unitPrice.toNumber())}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right col: Summary + Shipping + Help */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-on-background">{formatIDR(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-on-background">{formatIDR(Number(order.shippingCost))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between font-body-sm text-body-sm">
                    <span className="text-on-surface-variant">Discount</span>
                    <span className="text-green-600">−{formatIDR(Number(order.discount))}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-surface-variant">
                <span className="font-body-md font-bold text-on-background">Total</span>
                <span className="font-h3 text-h3 font-bold text-primary">{formatIDR(Number(order.total))}</span>
              </div>
            </div>

            {/* Shipping Details */}
            {order.address && (
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
                <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">
                  Shipping Details
                </h2>
                {order.shippingCourier && (
                  <div className="mb-3">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Courier</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium uppercase">
                      {order.shippingCourier} {order.shippingService && `(${order.shippingService})`}
                    </p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="mb-3">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="font-mono font-body-sm text-body-sm text-primary font-semibold">{order.trackingNumber}</p>
                  </div>
                )}
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="font-body-md text-body-md text-on-surface font-medium">{order.address.recipient}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{order.address.phone}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {order.address.street}, {order.address.city},<br />
                    {order.address.province} {order.address.postalCode}
                  </p>
                </div>
              </div>
            )}

            {/* Need Help? */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 text-center">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant block mb-2">support_agent</span>
              <h3 className="font-h3 text-h3 text-on-surface mb-1">Need Help?</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Contact our support team regarding this order.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 border border-outline-variant rounded text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">contact_support</span>
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
