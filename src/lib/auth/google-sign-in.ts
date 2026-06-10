import { siteConfig } from '@/config/site';

export function isGoogleSignInEnabled() {
  return Boolean(siteConfig.apiUrl?.trim());
}

export function getGoogleSignInUrl(returnTo?: string) {
  const url = new URL('/auth/google', siteConfig.apiUrl);
  if (returnTo?.startsWith('/')) {
    url.searchParams.set('returnTo', returnTo);
  }
  return url.toString();
}

export function startGoogleSignIn(returnTo?: string) {
  window.location.assign(getGoogleSignInUrl(returnTo));
}
