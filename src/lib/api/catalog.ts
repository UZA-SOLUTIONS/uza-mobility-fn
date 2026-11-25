import { apiFetch } from '@/lib/api/api';
import type { Category } from '@/types/catalog';

const publicCatalogFetch = { cache: 'no-store' as const };

export function getPublicCategories() {
  return apiFetch<Category[]>('/categories', publicCatalogFetch);
}
