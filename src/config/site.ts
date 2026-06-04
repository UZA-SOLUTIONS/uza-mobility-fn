export const siteConfig = {
  name: 'Uza Mobility',
  description: 'Electric vehicle marketplace and mobility platform for Rwanda.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7000',
} as const;

/** Canonical site origin for sitemaps, metadata, and OG URLs (no trailing slash). */
export function getSiteOrigin(): string {
  return siteConfig.url.replace(/\/$/, '');
}
