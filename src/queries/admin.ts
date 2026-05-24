'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  activatePart,
  approveListing,
  deactivatePart,
  deleteListing,
  featureListing,
  getAdminListings,
  getAdminParts,
  getAdminSeller,
  getAdminSellers,
  getDashboard,
  hotDealListing,
  publishListing,
  reactivateSeller,
  rejectListing,
  suspendSeller,
  verifySeller,
} from '@/lib/api/admin';
import {
  addSubcategory,
  createCategory,
  deactivateCategory,
  getCategories,
  updateCategory,
} from '@/lib/api/categories';
import { ApiClientError } from '@/lib/api';
import type {
  AdminListingsFilters,
  AdminPartsFilters,
  AdminSellersFilters,
} from '@/types/admin/marketplace';
import type {
  CreateCategoryInput,
  CreateSubcategoryInput,
  RejectListingInput,
  SuspendSellerInput,
} from '@/schemas/admin';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  listings: (filters: AdminListingsFilters) =>
    [...adminKeys.all, 'listings', filters] as const,
  sellers: (filters: AdminSellersFilters) =>
    [...adminKeys.all, 'sellers', filters] as const,
  seller: (id: string) => [...adminKeys.all, 'seller', id] as const,
  parts: (filters: AdminPartsFilters) =>
    [...adminKeys.all, 'parts', filters] as const,
  categories: () => [...adminKeys.all, 'categories'] as const,
};

function mutationError(error: unknown) {
  return error instanceof ApiClientError
    ? error.message
    : 'Something went wrong. Please try again.';
}

export function useDashboard(enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: getDashboard,
    enabled,
    staleTime: 60_000,
  });
}

export function useAdminListings(
  filters: AdminListingsFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: adminKeys.listings(filters),
    queryFn: () => getAdminListings(filters),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useApproveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveListing,
    onSuccess: () => {
      toast.success('Listing approved');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function usePublishListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishListing,
    onSuccess: () => {
      toast.success('Listing published');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useRejectListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RejectListingInput }) =>
      rejectListing(id, body),
    onSuccess: () => {
      toast.success('Listing rejected');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useFeatureListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: featureListing,
    onSuccess: () => {
      toast.success('Featured flag updated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useHotDealListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotDealListing,
    onSuccess: () => {
      toast.success('Hot deal flag updated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      toast.success('Listing deleted');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useAdminSellers(filters: AdminSellersFilters, enabled = true) {
  return useQuery({
    queryKey: adminKeys.sellers(filters),
    queryFn: () => getAdminSellers(filters),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useAdminSeller(id: string | null) {
  return useQuery({
    queryKey: adminKeys.seller(id ?? ''),
    queryFn: () => getAdminSeller(id!),
    enabled: Boolean(id),
  });
}

export function useVerifySeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifySeller,
    onSuccess: () => {
      toast.success('Seller verified');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useSuspendSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: SuspendSellerInput }) =>
      suspendSeller(id, body),
    onSuccess: () => {
      toast.success('Seller suspended');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useReactivateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateSeller,
    onSuccess: () => {
      toast.success('Seller reactivated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useAdminParts(filters: AdminPartsFilters, enabled = true) {
  return useQuery({
    queryKey: adminKeys.parts(filters),
    queryFn: () => getAdminParts(filters),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useActivatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activatePart,
    onSuccess: () => {
      toast.success('Part activated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useDeactivatePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivatePart,
    onSuccess: () => {
      toast.success('Part deactivated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useCategories(enabled = true) {
  return useQuery({
    queryKey: adminKeys.categories(),
    queryFn: getCategories,
    enabled,
    staleTime: 120_000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCategoryInput) => createCategory(body),
    onSuccess: () => {
      toast.success('Category created');
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<CreateCategoryInput> & { isActive?: boolean };
    }) => updateCategory(id, body),
    onSuccess: () => {
      toast.success('Category updated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCategory,
    onSuccess: () => {
      toast.success('Category deactivated');
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useAddSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      body,
    }: {
      categoryId: string;
      body: CreateSubcategoryInput;
    }) => addSubcategory(categoryId, body),
    onSuccess: () => {
      toast.success('Subcategory added');
      void queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}
