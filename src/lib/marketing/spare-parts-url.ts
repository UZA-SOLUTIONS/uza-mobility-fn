import type { SparePartsSearchParams } from '@/lib/marketing/spare-parts-browse';

export function sparePartsHref(filters?: SparePartsSearchParams) {
  const params = new URLSearchParams();

  if (filters?.q?.trim()) params.set('q', filters.q.trim());
  if (filters?.category) params.set('category', filters.category);
  if (filters?.brand) params.set('brand', filters.brand);
  if (filters?.model) params.set('model', filters.model);

  const qs = params.toString();
  return qs ? `/spare-parts?${qs}` : '/spare-parts';
}
