import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { SignOutButton } from "@/app/(auth)/sign-out-button";
import { updateProfile } from "./actions";

export const metadata = {
  title: "EnterpriseStore - Account",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?redirectTo=/account");
  }

  const { tab = "orders" } = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen">
      <Navbar active="Account" />

      {/* App Layout Container */}
      <div className="flex max-w-[1440px] mx-auto pt-16 min-h-screen">
        {/* SideNavBar */}
        <aside className="w-64 bg-inverse-surface border-r border-outline flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:flex flex-col">
          <div className="p-6 border-b border-outline/30 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center flex-shrink-0 overflow-hidden text-on-primary-container font-bold uppercase">
              {user.image ? (
                <img
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  src={user.image}
                />
              ) : (
                user.name?.[0] ?? user.email[0]
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-inverse-on-surface font-h2 text-h2 font-bold leading-tight truncate">
                {user.name || "User"}
              </div>
              <div className="text-inverse-on-surface/70 font-body-sm text-body-sm mt-0.5 capitalize truncate">
                {user.role.toLowerCase()} Member
              </div>
            </div>
          </div>
          <nav className="flex-1 py-4 flex flex-col gap-1">
            <Link
              href="/account?tab=orders"
              className={`font-body-sm text-body-sm flex items-center gap-3 px-4 py-3 transition-colors ${
                tab === "orders"
                  ? "bg-on-secondary-fixed text-inverse-on-surface border-l-4 border-primary"
                  : "text-surface-variant hover:text-inverse-on-surface hover:bg-on-secondary-fixed"
              }`}
            >
              <span className="material-symbols-outlined" style={tab === "orders" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                package_2
              </span>
              My Orders
            </Link>
            <Link
              href="/account?tab=settings"
              className={`font-body-sm text-body-sm flex items-center gap-3 px-4 py-3 transition-colors ${
                tab === "settings"
                  ? "bg-on-secondary-fixed text-inverse-on-surface border-l-4 border-primary"
                  : "text-surface-variant hover:text-inverse-on-surface hover:bg-on-secondary-fixed"
              }`}
            >
              <span className="material-symbols-outlined" style={tab === "settings" ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                settings
              </span>
              Profile Settings
            </Link>
            <Link
              href="/support"
              className="font-body-sm text-body-sm flex items-center gap-3 text-surface-variant px-4 py-3 hover:text-inverse-on-surface hover:bg-on-secondary-fixed transition-colors mt-auto border-t border-outline/30 pt-4"
            >
              <span className="material-symbols-outlined">contact_support</span>
              Support
            </Link>
            <SignOutButton />
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 p-8 bg-background overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <header className="mb-8">
              <h1 className="font-h1 text-h1 text-on-background">User Profile</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Manage your account details and track recent activity.
              </p>
            </header>

            {/* Local Tab System */}
            <div className="border-b border-surface-variant mb-6 flex gap-8">
              <Link
                href="/account?tab=orders"
                className={`font-body-md text-body-md pb-3 font-medium transition-colors ${
                  tab === "orders"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-background"
                }`}
              >
                Order History
              </Link>
              <Link
                href="/account?tab=settings"
                className={`font-body-md text-body-md pb-3 font-medium transition-colors ${
                  tab === "settings"
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-background"
                }`}
              >
                Profile Settings
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              {tab === "orders" && (
                <section className="bg-surface-container-lowest border border-surface-variant rounded flex flex-col">
                  <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright rounded-t">
                    <h2 className="font-h2 text-h2 text-on-background">Recent Orders</h2>
                  </div>
                  <div className="w-full overflow-x-auto">
                    {user.orders.length === 0 ? (
                      <div className="p-8 text-center text-on-surface-variant font-body-md text-body-md">
                        You don't have any recent orders.
                        <br />
                        <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                          Start shopping
                        </Link>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-surface-variant bg-surface-container-low">
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="font-data-tabular text-data-tabular text-on-background">
                          {user.orders.map((order) => {
                            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                            return (
                              <tr
                                key={order.id}
                                className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                              >
                                <td className="px-6 py-4 font-medium">#{order.orderNumber}</td>
                                <td className="px-6 py-4 text-on-surface-variant">
                                  {order.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">{itemCount} item{itemCount !== 1 ? 's' : ''}</td>
                                <td className="px-6 py-4">${Number(order.total).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                  <span className="inline-block px-2 py-1 bg-surface-container text-on-surface font-label-caps text-label-caps uppercase rounded-sm border border-outline-variant">
                                    {order.status.replace("_", " ")}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>
              )}

              {tab === "settings" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-surface-container-lowest border border-surface-variant rounded p-6 flex flex-col gap-6">
                    <h3 className="font-h2 text-h2 text-on-background border-b border-surface-variant pb-2">
                      Profile Information
                    </h3>
                    <form action={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Full Name
                        </label>
                        <input
                          name="name"
                          defaultValue={user.name || ""}
                          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md text-on-background transition-all"
                          type="text"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          defaultValue={user.phone || ""}
                          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md text-on-background transition-all"
                          type="tel"
                        />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Email Address
                        </label>
                        <input
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded outline-none font-body-md text-body-md text-on-surface-variant cursor-not-allowed"
                          readOnly
                          type="email"
                          value={user.email}
                        />
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Email cannot be changed.</span>
                      </div>
                      <div className="md:col-span-2 flex justify-end mt-2">
                        <button
                          className="bg-primary text-on-primary font-body-sm text-body-sm px-4 py-2 rounded hover:bg-surface-tint transition-colors active:scale-95"
                          type="submit"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-surface-container-lowest border border-surface-variant rounded p-6 flex flex-col gap-4">
                    <h3 className="font-h2 text-h2 text-on-background border-b border-surface-variant pb-2">
                      Account Security
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-body-sm text-body-sm font-medium text-on-background">Role</span>
                        <span className="text-on-surface-variant text-sm">{user.role}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-body-sm text-body-sm font-medium text-on-background">Registered Via</span>
                        <span className="text-on-surface-variant text-sm">
                           {user.passwordHash ? "Email & Password" : "OAuth Provider"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
