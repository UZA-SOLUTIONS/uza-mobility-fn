import { apiFetch } from '@/lib/api/api';
import type { Category } from '@/types/catalog';

export function getPublicCategories() {
  return apiFetch<Category[]>('/categories');
}
