import { apiFetch, apiFetchPaginated } from '@/lib/api/api';
import type { BrowseFilterOptions } from '@/lib/marketing/vehicles-browse';
import type { SellerType } from '@/types/catalog';
import type { PublicListing } from '@/types/marketplace/public-listing';

export type BrowseListingsFilters = {
  q?: string;
  category?: string;
  useCase?: string;
  limit?: number;
  page?: number;
  /** When true, API returns the full filtered set (ignores page/limit). */
  all?: boolean;
  sort?: string;
  brand?: string;
  model?: string;
  condition?: string;
  drivetrain?: string;
  color?: string;
  city?: string;
  country?: string;
  batteryCapacityKwh?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  priceMin?: number;
  priceMax?: number;
  sellerType?: SellerType;
};

/** Guest catalog reads stay fresh after admin updates (no Next Data Cache TTL). */
const publicListingFetch = { cache: 'no-store' as const };

export function getLocalStockListings() {
  return apiFetch<PublicListing[]>('/listings/local-stock', publicListingFetch);
}

export function getFeaturedListings() {
  return apiFetch<PublicListing[]>('/listings/featured', publicListingFetch);
}

export function getListingBySlug(slug: string) {
  return apiFetch<PublicListing>(`/listings/${encodeURIComponent(slug)}`, {
    ...publicListingFetch,
  });
}

export function getWishlistIds(token: string) {
  return apiFetch<string[]>('/listings/wishlist/ids', { token });
}

export function getWishlist(token: string) {
  return apiFetch<PublicListing[]>('/listings/wishlist', { token });
}

export function addToWishlist(listingId: string, token: string) {
  return apiFetch<{ message: string }>(
    `/listings/${encodeURIComponent(listingId)}/wishlist`,
    { method: 'POST', token },
  );
}

export function removeFromWishlist(listingId: string, token: string) {
  return apiFetch<{ message: string }>(
    `/listings/${encodeURIComponent(listingId)}/wishlist`,
    { method: 'DELETE', token },
  );
}

export function browseListings(filters: BrowseListingsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.all) {
    params.set('all', 'true');
  } else {
    params.set('limit', String(filters.limit ?? 24));
    params.set('page', String(filters.page ?? 1));
  }
  if (filters.q?.trim()) params.set('q', filters.q.trim());
  if (filters.category) params.set('category', filters.category);
  if (filters.useCase) params.set('useCase', filters.useCase);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.model) params.set('model', filters.model);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.drivetrain) params.set('drivetrain', filters.drivetrain);
  if (filters.color) params.set('color', filters.color);
  if (filters.city) params.set('city', filters.city);
  if (filters.country) params.set('country', filters.country);
  if (filters.sellerType) params.set('sellerType', filters.sellerType);
  if (filters.batteryCapacityKwh != null) {
    params.set('batteryCapacityKwh', String(filters.batteryCapacityKwh));
  }
  if (filters.yearMin != null) params.set('yearMin', String(filters.yearMin));
  if (filters.yearMax != null) params.set('yearMax', String(filters.yearMax));
  if (filters.mileageMin != null) {
    params.set('mileageMin', String(filters.mileageMin));
  }
  if (filters.mileageMax != null) {
    params.set('mileageMax', String(filters.mileageMax));
  }
  if (filters.priceMin != null)
    params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax != null)
    params.set('priceMax', String(filters.priceMax));

  return apiFetchPaginated<PublicListing>('/listings', {
    searchParams: params,
    ...publicListingFetch,
  });
}

/** Guest View All — one request for the full filtered catalog (`all=true`). */
export async function browseAllListings(
  filters: Omit<BrowseListingsFilters, 'page' | 'limit' | 'all'> = {},
): Promise<PublicListing[]> {
  const result = await browseListings({ ...filters, all: true });
  return result.items;
}

export function getBrowseFilterOptions(options?: {
  category?: string;
  brand?: string;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set('category', options.category);
  if (options?.brand) params.set('brand', options.brand);
  const qs = params.toString();
  const path = qs
    ? `/listings/browse-filters?${qs}`
    : '/listings/browse-filters';
  return apiFetch<BrowseFilterOptions>(path, publicListingFetch);
}
