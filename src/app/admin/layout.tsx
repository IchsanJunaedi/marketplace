import { ReactNode } from "react";
import { SignOutButton } from "@/app/(auth)/sign-out-button";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-admin bg-surface font-body-md text-on-surface antialiased overflow-hidden flex h-screen">
      {/* SideNavBar */}
      <nav className="h-screen w-64 fixed left-0 top-0 z-50 bg-surface-container-lowest border-r border-outline-variant flex flex-col transition-all duration-150 ease-in-out">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant">
          <h1 className="text-lg font-black tracking-tight text-on-surface">AdminConsole</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Enterprise Suite</p>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col flex-1 py-4 space-y-1 overflow-y-auto">
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin"
          >
            <span className="material-symbols-outlined mr-4">dashboard</span>
            Overview
          </Link>
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin/inventory"
          >
            <span className="material-symbols-outlined mr-4">inventory_2</span>
            Inventory
          </Link>
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin/orders"
          >
            <span className="material-symbols-outlined mr-4">shopping_cart</span>
            Orders
          </Link>
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin/reports"
          >
            <span className="material-symbols-outlined mr-4">analytics</span>
            Reports
          </Link>
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin/customers"
          >
            <span className="material-symbols-outlined mr-4">group</span>
            Customers
          </Link>
          <Link
            className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-md text-label-md transition-colors duration-200"
            href="/admin/settings"
          >
            <span className="material-symbols-outlined mr-4">settings</span>
            Settings
          </Link>
        </div>
        {/* Bottom User Area */}
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-variant flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className="ml-3">
              <p className="font-label-sm text-label-sm text-on-surface">Admin</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">System Admin</p>
            </div>
          </div>
          <SignOutButton
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface flex items-center gap-2 mt-3 w-full"
            label="Sign out"
          />
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-64 h-screen relative">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 left-64 z-40 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 h-16 transition-colors duration-200">
          <div className="flex-1 flex items-center">
            <h2 className="font-h3 text-h3 text-primary mr-8 hidden md:block">AdminPanel</h2>
            <div className="relative w-full max-w-[28rem]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface placeholder-on-surface-variant"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-DEFAULT transition-colors duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-DEFAULT transition-colors duration-200">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 mt-16 p-lg overflow-y-auto w-full max-w-container-max mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
