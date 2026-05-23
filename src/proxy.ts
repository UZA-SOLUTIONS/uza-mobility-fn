import { auth, authRedirect } from '@/lib/auth';
import {
  authRoutes,
  protectedWorkspacePrefixes,
  publicOnlyAuthPaths,
  workspaceRoutes,
} from '@/config/routes';
import { isMeUser } from '@/types/auth/me-user';
import { NextResponse } from 'next/server';

const legacyRedirects: Record<string, string> = {
  '/dashboard': workspaceRoutes.account,
  '/settings': workspaceRoutes.accountSettings,
  '/billing': workspaceRoutes.accountBilling,
};

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (legacyRedirects[pathname]) {
    return NextResponse.redirect(
      new URL(legacyRedirects[pathname], req.nextUrl.origin),
    );
  }

  const isAuthPage = publicOnlyAuthPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const isProtected = protectedWorkspacePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const user = req.auth?.user;

  if (isAuthPage && isMeUser(user)) {
    const destination = authRedirect(user);
    return NextResponse.redirect(new URL(destination, req.nextUrl.origin));
  }

  if (isProtected && !req.auth) {
    const login = new URL(authRoutes.login, req.nextUrl.origin);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/account/:path*',
    '/seller/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/dashboard/:path*',
    '/settings/:path*',
    '/billing/:path*',
  ],
};
