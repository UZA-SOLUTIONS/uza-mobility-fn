import {
  authenticatedFetch,
  authenticatedPaginatedFetch,
} from '@/lib/api/authenticated';
import { toSearchParams } from '@/lib/api/query-params';
import type { AdminDashboard } from '@/types/admin/dashboard';
import type {
  AdminListing,
  AdminListingsFilters,
  AdminPart,
  AdminPartsFilters,
  AdminSeller,
  AdminSellersFilters,
} from '@/types/admin/marketplace';
import type { RejectListingInput, SuspendSellerInput } from '@/schemas/admin';

export function getDashboard() {
  return authenticatedFetch<AdminDashboard>('/admin/dashboard');
}

export function getAdminListings(filters: AdminListingsFilters = {}) {
  return authenticatedPaginatedFetch<AdminListing>('/admin/listings', {
    searchParams: toSearchParams(filters),
  });
}

export function approveListing(id: string) {
  return authenticatedFetch<AdminListing>(`/admin/listings/${id}/approve`, {
    method: 'PATCH',
  });
}

export function publishListing(id: string) {
  return authenticatedFetch<AdminListing>(`/admin/listings/${id}/publish`, {
    method: 'PATCH',
  });
}

export function rejectListing(id: string, body: RejectListingInput) {
  return authenticatedFetch<AdminListing>(`/admin/listings/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function featureListing(id: string) {
  return authenticatedFetch<AdminListing>(`/admin/listings/${id}/feature`, {
    method: 'PATCH',
  });
}

export function hotDealListing(id: string) {
  return authenticatedFetch<AdminListing>(`/admin/listings/${id}/hot-deal`, {
    method: 'PATCH',
  });
}

export function deleteListing(id: string) {
  return authenticatedFetch<{ message: string }>(`/admin/listings/${id}`, {
    method: 'DELETE',
  });
}

export function getAdminSellers(filters: AdminSellersFilters = {}) {
  const params = toSearchParams({
    ...filters,
    isVerified:
      filters.isVerified === undefined ? undefined : String(filters.isVerified),
  });

  return authenticatedPaginatedFetch<AdminSeller>('/admin/sellers', {
    searchParams: params,
  });
}

export function getAdminSeller(id: string) {
  return authenticatedFetch<AdminSeller>(`/admin/sellers/${id}`);
}

export function verifySeller(id: string) {
  return authenticatedFetch<AdminSeller>(`/admin/sellers/${id}/verify`, {
    method: 'PATCH',
  });
}

export function suspendSeller(id: string, body: SuspendSellerInput = {}) {
  return authenticatedFetch<AdminSeller>(`/admin/sellers/${id}/suspend`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function reactivateSeller(id: string) {
  return authenticatedFetch<AdminSeller>(`/admin/sellers/${id}/reactivate`, {
    method: 'PATCH',
  });
}

export function getAdminParts(filters: AdminPartsFilters = {}) {
  return authenticatedPaginatedFetch<AdminPart>('/admin/parts', {
    searchParams: toSearchParams(filters),
  });
}

export function activatePart(id: string) {
  return authenticatedFetch<AdminPart>(`/admin/parts/${id}/activate`, {
    method: 'PATCH',
  });
}

export function deactivatePart(id: string) {
  return authenticatedFetch<AdminPart>(`/admin/parts/${id}/deactivate`, {
    method: 'PATCH',
  });
}
