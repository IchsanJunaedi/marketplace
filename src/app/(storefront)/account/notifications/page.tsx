import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  async function markAllRead() {
    "use server";
    const session = await auth();
    if (!session?.user) return;
    
    await prisma.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: new Date() },
    });
    revalidatePath("/account/notifications");
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Inbox</h1>
          <p className="text-on-surface-variant mt-1">Updates on your orders and account.</p>
        </div>
        {notifications.some(n => !n.readAt) && (
          <form action={markAllRead}>
            <button className="text-sm font-bold text-primary hover:underline">
              Mark all as read
            </button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest border border-surface-variant rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">notifications_off</span>
            <p className="text-on-surface-variant">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-xl border transition-colors ${
                n.readAt 
                  ? "bg-surface-container-lowest border-surface-variant" 
                  : "bg-primary-container/10 border-primary shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-2 rounded-full ${n.readAt ? "bg-surface-variant text-on-surface-variant" : "bg-primary text-on-primary"}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {n.type === "ORDER_CREATED" ? "shopping_cart" : 
                       n.type === "PAYMENT_RECEIVED" ? "payments" :
                       n.type === "ORDER_SHIPPED" ? "local_shipping" :
                       n.type === "ORDER_DELIVERED" ? "package_2" : "info"}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-bold ${n.readAt ? "text-on-surface" : "text-primary"}`}>{n.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-1">{n.body}</p>
                    <p className="text-[11px] text-on-surface-variant mt-2">
                      {n.createdAt.toLocaleDateString("id-ID", { 
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
                {n.link && (
                  <a href={n.link} className="text-sm font-bold text-primary hover:underline">View</a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
