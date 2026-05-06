import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts`. This file runs on every
 * request matching `config.matcher`.
 */
const { auth } = NextAuth(authConfig);

// Simple in-memory rate limit map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;

export default auth((req) => {
  const ip = (req as any).ip || req.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  // Rate limiting for sensitive routes
  if (req.nextUrl.pathname.startsWith('/api/checkout') || req.nextUrl.pathname.startsWith('/auth')) {
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    if (now - record.lastReset > WINDOW_MS) {
      record.count = 1;
      record.lastReset = now;
    } else {
      record.count++;
    }
    rateLimitMap.set(ip, record);
    if (record.count > RATE_LIMIT) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)"],
};
