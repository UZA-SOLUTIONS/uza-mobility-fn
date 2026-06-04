import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/config/site';
import { fetchSitemapListingEntries } from '@/lib/seo/sitemap-listings';

const baseUrl = getSiteOrigin();

/** Public marketing routes indexed for search engines. */
const staticMarketingRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/vehicles', changeFrequency: 'daily', priority: 0.9 },
  { path: '/spare-parts', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/for-business', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.5 },
];

/** Regenerate at most once per hour when crawlers hit /sitemap.xml. */
export const revalidate = 3600;

/** Always read live listings from the API (not a stale build-time snapshot). */
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticMarketingRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const listings = await fetchSitemapListingEntries();
  const vehicleEntries: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${baseUrl}/vehicles/${encodeURIComponent(listing.slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...vehicleEntries];
}
