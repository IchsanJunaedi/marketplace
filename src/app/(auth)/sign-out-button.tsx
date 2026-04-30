import { signOutAction } from "./actions";

type Props = {
  className?: string;
  label?: string;
};

/**
 * Minimal Sign Out button — renders as a form/button so the underlying
 * server action can clear the session cookie via Auth.js. Default styling
 * matches the storefront sidebar nav item; pass `className` to restyle for
 * other contexts (e.g. admin sidebar).
 */
export function SignOutButton({
  className = "font-body-sm text-body-sm flex items-center gap-3 text-surface-variant px-4 py-3 hover:text-inverse-on-surface hover:bg-on-secondary-fixed transition-all duration-200 w-full text-left",
  label = "Sign out",
}: Props) {
  return (
    <form action={signOutAction}>
      <button type="submit" className={className}>
        <span className="material-symbols-outlined" aria-hidden>
          logout
        </span>
        {label}
      </button>
    </form>
  );
}
