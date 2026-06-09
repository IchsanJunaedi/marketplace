import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { SignOutButton } from "@/app/(auth)/sign-out-button";
import { updateProfile } from "./actions";
import { formatIDR } from "@/lib/utils";

export const metadata = {
  title: "HerbalStore - Account",
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

  if (!user) redirect("/auth/signin");

  const totalSpend = user.orders.reduce(
    (sum, o) => sum + o.total.toNumber(),
    0
  );

  const navItems = [
    { label: "Dashboard",        icon: "dashboard",     href: "/account?tab=orders"   },
    { label: "My Orders",        icon: "package_2",     href: "/account?tab=orders"   },
    { label: "Account Settings", icon: "settings",      href: "/account?tab=settings" },
    { label: "Support",          icon: "contact_support", href: "/support"             },
  ];

  const tabs = [
    { key: "orders",   label: "Order History & Tracking" },
    { key: "settings", label: "Profile Settings"          },
  ];

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen">
      <Navbar active="Account" />

      <div className="flex max-w-[1440px] mx-auto pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-inverse-surface border-r border-outline flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 hidden md:flex flex-col">
          {/* Avatar + Name */}
          <div className="p-6 border-b border-outline/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 overflow-hidden text-on-primary-container font-bold uppercase text-lg">
              {user.image ? (
                <img alt="Avatar" className="w-full h-full object-cover" src={user.image} />
              ) : (
                user.name?.[0] ?? user.email[0]
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-inverse-on-surface font-h2 text-h2 font-bold leading-tight truncate">
                {user.name || "User"}
              </div>
              <div className="text-inverse-on-surface/60 font-body-sm text-body-sm mt-0.5 capitalize truncate">
                {user.isWholesale ? "Wholesale" : user.role.toLowerCase()} Member
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3 overflow-y-auto">
            {navItems.map(({ label, icon, href }) => {
              const isActive =
                (label === "Dashboard" || label === "My Orders") && tab === "orders"
                  ? true
                  : label === "Account Settings" && tab === "settings"
                  ? true
                  : false;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body-sm text-body-sm ${
                    isActive
                      ? "bg-on-secondary-fixed text-inverse-on-surface"
                      : "text-surface-variant hover:text-inverse-on-surface hover:bg-on-secondary-fixed/60"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-outline/30">
            <SignOutButton />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 bg-background overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <header className="mb-6">
              <h1 className="font-h1 text-h1 text-on-background">User Profile</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Manage your account details and track recent activity.
              </p>
            </header>

            {/* Tabs */}
            <div className="border-b border-surface-variant mb-6 flex gap-8">
              {tabs.map(({ key, label }) => (
                <Link
                  key={key}
                  href={`/account?tab=${key}`}
                  className={`font-body-md text-body-md pb-3 font-medium transition-colors ${
                    tab === key
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-on-background"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── ORDER HISTORY TAB ── */}
            {tab === "orders" && (
              <div className="flex flex-col gap-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-4">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Orders</p>
                    <p className="font-h2 text-h2 text-on-background mt-1">{user.orders.length}</p>
                  </div>
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-4">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Spend</p>
                    <p className="font-h2 text-h2 text-primary mt-1">{formatIDR(totalSpend)}</p>
                  </div>
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-4">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Member Since</p>
                    <p className="font-h2 text-h2 text-on-background mt-1">
                      {user.createdAt.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Orders table */}
                <section className="bg-surface-container-lowest border border-surface-variant rounded-lg flex flex-col">
                  <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright rounded-t-lg">
                    <h2 className="font-h2 text-h2 text-on-background">Recent Orders</h2>
                    {user.orders.length > 5 && (
                      <span className="font-body-sm text-body-sm text-primary">
                        Showing latest {Math.min(user.orders.length, 20)}
                      </span>
                    )}
                  </div>
                  <div className="w-full overflow-x-auto">
                    {user.orders.length === 0 ? (
                      <div className="p-12 text-center text-on-surface-variant font-body-md text-body-md">
                        <span className="material-symbols-outlined text-[48px] block mb-3">shopping_bag</span>
                        Anda belum memiliki riwayat pesanan.
                        <br />
                        <Link href="/" className="text-primary hover:underline mt-2 inline-block">
                          Mulai belanja
                        </Link>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-surface-variant bg-surface-container-low">
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">Order ID</th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">Date</th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">Items</th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">Total</th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider">Status</th>
                            <th className="font-label-caps text-label-caps text-on-surface-variant px-6 py-3 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="font-body-sm text-body-sm text-on-background">
                          {user.orders.map((order) => {
                            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
                            const style = STATUS_STYLE[order.status] ?? "bg-surface-container text-on-surface border border-outline-variant";
                            const label = STATUS_LABEL[order.status] ?? order.status;
                            return (
                              <tr
                                key={order.id}
                                className="border-b border-surface-variant hover:bg-surface-container-low transition-colors"
                              >
                                <td className="px-6 py-4 font-medium">
                                  <Link href={`/account/orders/${order.id}`} className="text-primary hover:underline">
                                    #{order.orderNumber}
                                  </Link>
                                </td>
                                <td className="px-6 py-4 text-on-surface-variant">
                                  {order.createdAt.toLocaleDateString("id-ID", {
                                    day: "2-digit", month: "short", year: "numeric",
                                  })}
                                </td>
                                <td className="px-6 py-4">{itemCount} item{itemCount !== 1 ? "s" : ""}</td>
                                <td className="px-6 py-4 font-medium">{formatIDR(Number(order.total))}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-block px-2.5 py-1 rounded-full font-label-sm text-[11px] font-semibold whitespace-nowrap ${style}`}>
                                    {label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {order.status === "SHIPPED" && (
                                      <Link
                                        href={`/account/orders/${order.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded border border-teal-300 bg-teal-50 text-teal-700 font-label-sm text-[11px] font-semibold hover:bg-teal-100 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                        Track
                                      </Link>
                                    )}
                                    <Link
                                      href={`/account/orders/${order.id}`}
                                      className="inline-flex items-center gap-1 px-3 py-1 rounded border border-outline-variant bg-surface text-on-surface font-label-sm text-[11px] font-semibold hover:bg-surface-container-low transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                                      Details
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>

                {/* Quick Settings + Security row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Quick Settings */}
                  <div className="md:col-span-2 bg-surface-container-lowest border border-surface-variant rounded-lg p-6">
                    <h3 className="font-h3 text-h3 text-on-background mb-4 pb-2 border-b border-surface-variant">
                      Quick Settings
                    </h3>
                    <form action={updateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px] tracking-wider">
                          Full Name
                        </label>
                        <input
                          name="name"
                          defaultValue={user.name || ""}
                          className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md text-on-background transition-all"
                          type="text"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px] tracking-wider">
                          Email Address
                        </label>
                        <input
                          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded outline-none font-body-md text-body-md text-on-surface-variant cursor-not-allowed"
                          readOnly
                          type="email"
                          value={user.email}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          className="bg-primary text-on-primary font-body-sm text-body-sm px-5 py-2 rounded hover:bg-surface-tint transition-colors active:scale-95"
                          type="submit"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Security */}
                  <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6">
                    <h3 className="font-h3 text-h3 text-on-background mb-4 pb-2 border-b border-surface-variant">
                      Security
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body-sm text-body-sm font-medium text-on-background">Two-Factor Auth</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Extra login protection</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-on-surface-variant border border-outline-variant">
                          N/A
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body-sm text-body-sm font-medium text-on-background">Password</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                            {user.passwordHash ? "Set via email" : "OAuth login"}
                          </p>
                        </div>
                        {user.passwordHash && (
                          <Link
                            href="/account?tab=settings"
                            className="font-body-sm text-[11px] text-primary hover:underline font-medium"
                          >
                            Update
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-surface-variant">
                        <div>
                          <p className="font-body-sm text-body-sm font-medium text-on-background">Account Role</p>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 capitalize">
                            {user.role.toLowerCase()}
                          </p>
                        </div>
                        {user.isWholesale && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-container/20 text-primary border border-primary/20">
                            Wholesale
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === "settings" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-surface-container-lowest border border-surface-variant rounded-lg p-6 flex flex-col gap-6">
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
                        placeholder="+62..."
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
                        className="bg-primary text-on-primary font-body-sm text-body-sm px-6 py-2 rounded hover:bg-surface-tint transition-colors active:scale-95"
                        type="submit"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-6 flex flex-col gap-5">
                  <h3 className="font-h2 text-h2 text-on-background border-b border-surface-variant pb-2">
                    Account Security
                  </h3>

                  <div className="flex flex-col gap-1">
                    <span className="font-body-sm text-body-sm font-medium text-on-background">Role</span>
                    <span className="text-on-surface-variant text-sm capitalize">{user.role.toLowerCase()}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-body-sm text-body-sm font-medium text-on-background">Registered Via</span>
                    <span className="text-on-surface-variant text-sm">
                      {user.passwordHash ? "Email & Password" : "OAuth Provider"}
                    </span>
                  </div>

                  {user.isWholesale && (
                    <div className="flex flex-col gap-1">
                      <span className="font-body-sm text-body-sm font-medium text-on-background">Account Type</span>
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Wholesale Member
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 pt-3 border-t border-surface-variant">
                    <span className="font-body-sm text-body-sm font-medium text-on-background">Member Since</span>
                    <span className="text-on-surface-variant text-sm">
                      {user.createdAt.toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
