import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`. This file runs on every
 * request matching `config.matcher`, gates protected routes, and redirects
 * unauthenticated users to /auth/signin.
 *
 * Edge-safe: only imports `authConfig` (no Prisma/bcrypt).
 */
export default NextAuth(authConfig).auth;

export const config = {
  // Skip Next internals + static assets; everything else passes through auth.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)"],
};
