import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // 1. Protect Student Routes (/user/...)
  if (pathname.startsWith('/user')) {
    if (!token || role !== 'user') {
      if (role === 'verifier') {
        return NextResponse.redirect(new URL('/professor/request', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Protect Professor Routes (/professor/...)
  if (pathname.startsWith('/professor')) {
    if (!token || role !== 'verifier') {
      if (role === 'user') {
        return NextResponse.redirect(new URL('/user/overview', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which paths this middleware runs on
export const config = {
  matcher: ['/user/:path*', '/professor/:path*'],
};
