/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getCartCount } from "@/lib/cart";

export default async function Navbar({ active }: { active?: string }) {
  const cartCount = await getCartCount();

  const navLinks = [
    { href: "/", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/deals", label: "Deals" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-surface-variant flex justify-between items-center px-6 h-16 max-w-[1440px] mx-auto left-0 right-0">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-xl font-black text-on-background tracking-tight"
        >
          EnterpriseStore
        </Link>
        <nav className="hidden md:flex items-center gap-6 mt-0.5">
          {navLinks.map((link) => {
            const isActive = active === link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "font-body-md text-body-md font-medium text-primary border-b-2 border-primary pb-1 h-full flex items-center"
                    : "font-body-md text-body-md font-medium text-on-surface-variant hover:text-on-background hover:bg-surface-container-low transition-colors px-2 py-1 rounded"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
            search
          </span>
          <input
            className="pl-10 pr-4 py-1.5 w-64 bg-surface border border-outline-variant rounded font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant"
            placeholder="Search catalog..."
            type="text"
          />
        </div>

        {/* Cart icon with badge */}
        <Link
          href="/cart"
          className={`relative p-2 rounded-full transition-colors flex items-center justify-center active:scale-95 duration-150 ${
            active === "Cart"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>

        <Link
          href="/account"
          className={`p-2 rounded-full transition-colors flex items-center justify-center active:scale-95 duration-150 ${
            active === "Account"
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={
              active === "Account"
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            account_circle
          </span>
        </Link>
      </div>
    </header>
  );
}
