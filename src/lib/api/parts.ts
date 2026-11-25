import { apiFetchPaginated } from '@/lib/api/api';
import type { PublicPart } from '@/types/marketplace/public-part';

export type BrowsePartsFilters = {
  q?: string;
  category?: string;
  brand?: string;
  model?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  /** When true, API returns the full filtered set (ignores page/limit). */
  all?: boolean;
};

const publicPartsFetch = { cache: 'no-store' as const };

export function browsePublicParts(filters: BrowsePartsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.all) {
    params.set('all', 'true');
  } else {
    params.set('limit', String(filters.limit ?? 24));
    params.set('page', String(filters.page ?? 1));
  }

  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.category) params.set('category', filters.category);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.model) params.set('model', filters.model);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.priceMin != null)
    params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax != null)
    params.set('priceMax', String(filters.priceMax));
  if (filters.inStock != null) params.set('inStock', String(filters.inStock));

  return apiFetchPaginated<PublicPart>('/parts', {
    searchParams: params,
    ...publicPartsFetch,
  });
}

/** Guest spare-parts browse — one request for the full filtered catalog (`all=true`). */
export async function browseAllPublicParts(
  filters: Omit<BrowsePartsFilters, 'page' | 'limit' | 'all'> = {},
): Promise<PublicPart[]> {
  const result = await browsePublicParts({ ...filters, all: true });
  return result.items;
}
