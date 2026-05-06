import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: { product: { include: { images: true } } },
      },
      address: true,
    },
  });

  if (!order) {
    redirect("/account?tab=orders");
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/account?tab=orders" className="text-primary hover:underline flex items-center gap-2 mb-4 font-body-sm text-body-sm w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Orders
          </Link>
          <h1 className="font-h1 text-h1 text-on-background">Order #{order.orderNumber}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Placed on {order.createdAt.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-surface-container rounded overflow-hidden flex-shrink-0">
                      {item.product.images[0] ? (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-body-md text-body-md font-medium">{item.productName}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.quantity} x Rp {Number(item.unitPrice).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="font-data-tabular text-data-tabular text-on-background font-medium">
                      Rp {(item.quantity * Number(item.unitPrice)).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-data-tabular text-data-tabular text-on-background">
                    Rp {Number(order.subtotal).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="font-data-tabular text-data-tabular text-on-background">
                    Rp {Number(order.shippingCost).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-surface-variant">
                <span className="font-body-md font-bold text-on-background">Total</span>
                <span className="font-data-tabular text-data-tabular font-bold text-primary">
                  Rp {Number(order.total).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">Shipping To</h2>
              <p className="font-body-md text-body-md font-medium text-on-background">{order.address?.recipient}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{order.address?.phone}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                {order.address?.street}, {order.address?.city}, {order.address?.province} {order.address?.postalCode}
              </p>
              <div className="mt-4 pt-4 border-t border-surface-variant">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Courier</p>
                <p className="font-body-md text-body-md text-on-background font-medium uppercase">
                  {order.shippingCourier} - {order.shippingService}
                </p>
              </div>
            </div>
            
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
              <h2 className="font-h2 text-h2 text-on-surface mb-4 pb-2 border-b border-surface-variant">Status</h2>
              <span className="inline-block px-3 py-1 bg-surface-container text-on-surface font-label-caps text-label-caps uppercase rounded-sm border border-outline-variant">
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}