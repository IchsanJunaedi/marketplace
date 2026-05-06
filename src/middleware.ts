import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limit map (User IP -> { count, lastReset })
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 100; // requests
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  
  // Only rate limit sensitive endpoints
  if (request.nextUrl.pathname.startsWith('/api/checkout') || 
      request.nextUrl.pathname.startsWith('/auth')) {
    
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
}

export const config = {
  matcher: ['/api/:path*', '/auth/:path*'],
};
