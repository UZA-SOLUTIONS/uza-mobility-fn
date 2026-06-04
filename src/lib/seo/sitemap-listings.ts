import { browseListings } from '@/lib/api/marketplace';
import { PUBLIC_LISTINGS_PAGE_LIMIT } from '@/lib/api/buyer';

export type SitemapListingEntry = {
  slug: string;
};

/** Fetches all published marketplace listing slugs for sitemap generation. */
export async function fetchSitemapListingEntries(): Promise<
  SitemapListingEntry[]
> {
  const entries: SitemapListingEntry[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const result = await browseListings({
        page,
        limit: PUBLIC_LISTINGS_PAGE_LIMIT,
      });
      for (const listing of result.items) {
        if (listing.slug?.trim()) {
          entries.push({ slug: listing.slug.trim() });
        }
      }
      totalPages = result.meta.totalPages;
      page += 1;
    } while (page <= totalPages);
  } catch {
    return entries;
  }

  return entries;
}
