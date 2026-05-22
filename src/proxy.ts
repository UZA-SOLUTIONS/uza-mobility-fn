import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const DASHBOARD_PREFIXES = ['/dashboard', '/settings', '/billing'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !req.auth) {
    const login = new URL('/login', req.nextUrl.origin);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/billing/:path*'],
};
