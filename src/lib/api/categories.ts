import { authenticatedFetch } from '@/lib/api/authenticated';
import type { Category, Subcategory } from '@/types/admin/marketplace';
import type {
  CreateCategoryInput,
  CreateSubcategoryInput,
} from '@/schemas/admin';

export function getCategories() {
  return authenticatedFetch<Category[]>('/categories');
}

export function createCategory(body: CreateCategoryInput) {
  const payload = {
    ...body,
    iconUrl: body.iconUrl || undefined,
  };

  return authenticatedFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCategory(
  id: string,
  body: Partial<CreateCategoryInput> & { isActive?: boolean },
) {
  return authenticatedFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deactivateCategory(id: string) {
  return authenticatedFetch<Category>(`/categories/${id}`, {
    method: 'DELETE',
  });
}

export function addSubcategory(
  categoryId: string,
  body: CreateSubcategoryInput,
) {
  return authenticatedFetch<Subcategory>(
    `/categories/${categoryId}/subcategories`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
}
