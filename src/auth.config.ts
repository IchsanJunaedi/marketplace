import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config.
 *
 * Imported by `src/proxy.ts` (which runs in the Edge runtime), so this file
 * MUST NOT import anything from `@/lib/db` (Prisma + node-mariadb), bcrypt,
 * or any Node-only module. The full config (`src/auth.ts`) extends this with
 * the Credentials provider + Prisma adapter for the API route.
 */
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const role = (auth?.user as { role?: "CUSTOMER" | "ADMIN" } | undefined)
        ?.role;
      const path = nextUrl.pathname;

      // Block /admin/* unless ADMIN.
      if (path.startsWith("/admin")) {
        return isLoggedIn && role === "ADMIN";
      }

      // /account, /cart, /checkout all require a logged-in user.
      if (
        path.startsWith("/account") ||
        path.startsWith("/cart") ||
        path.startsWith("/checkout")
      ) {
        return isLoggedIn;
      }

      // /auth/signin and /auth/signup are public; redirect logged-in users.
      if (path.startsWith("/auth/")) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "CUSTOMER" | "ADMIN" }).role ?? "CUSTOMER";
        token.isWholesale = (user as { isWholesale?: boolean }).isWholesale ?? false;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: "CUSTOMER" | "ADMIN" }).role =
          (token.role as "CUSTOMER" | "ADMIN") ?? "CUSTOMER";
        (session.user as { isWholesale?: boolean }).isWholesale = 
          token.isWholesale as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
