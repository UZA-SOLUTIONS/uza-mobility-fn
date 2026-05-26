'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api';
import { getPublicCategories } from '@/lib/api/catalog';
import {
  createListing,
  createPart,
  createSellerProfile,
  deactivatePart,
  deleteListing,
  getMyListings,
  getMyParts,
  getSellerProfiles,
  submitListing,
  updateListing,
  updatePart,
  uploadListingPhotos,
} from '@/lib/api/seller';
import { refreshSession } from '@/lib/auth/session-update';
import { updateSellerProfile } from '@/lib/api/profile';
import { authKeys } from '@/queries/auth';
import type {
  CreatePartInput,
  CreateSellerListingInput,
  CreateSellerProfileInput,
  UpdatePartInput,
  UpdateSellerListingInput,
} from '@/schemas/seller';
import type { UpdateSellerProfileInput } from '@/schemas/profile';

export const sellerKeys = {
  all: ['seller'] as const,
  listings: () => [...sellerKeys.all, 'listings'] as const,
  parts: () => [...sellerKeys.all, 'parts'] as const,
  categories: () => [...sellerKeys.all, 'categories'] as const,
  profiles: () => [...sellerKeys.all, 'profiles'] as const,
};

function mutationError(error: unknown) {
  return error instanceof ApiClientError
    ? error.message
    : 'Something went wrong. Please try again.';
}

export function useSellerCategories(enabled = true) {
  return useQuery({
    queryKey: sellerKeys.categories(),
    queryFn: getPublicCategories,
    enabled,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: sellerKeys.listings(),
    queryFn: getMyListings,
  });
}

export function useMyParts() {
  return useQuery({
    queryKey: sellerKeys.parts(),
    queryFn: getMyParts,
  });
}

export function useSellerProfiles() {
  return useQuery({
    queryKey: sellerKeys.profiles(),
    queryFn: getSellerProfiles,
  });
}

export function useCreateSellerListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      body,
      photos,
    }: {
      body: CreateSellerListingInput;
      photos: File[];
    }) => {
      const listing = await createListing(body);
      if (photos.length > 0) {
        return uploadListingPhotos(listing.id, photos);
      }
      return listing;
    },
    onSuccess: () => {
      toast.success('Listing saved as draft');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.listings() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUpdateSellerListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      body,
      photos,
    }: {
      id: string;
      body: UpdateSellerListingInput;
      photos: File[];
    }) => {
      const listing = await updateListing(id, body);
      if (photos.length > 0) {
        return uploadListingPhotos(id, photos);
      }
      return listing;
    },
    onSuccess: () => {
      toast.success('Listing updated');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.listings() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useDeleteSellerListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteListing(id),
    onSuccess: () => {
      toast.success('Draft listing deleted');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.listings() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useSubmitSellerListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submitListing(id),
    onSuccess: () => {
      toast.success('Listing submitted for review');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.listings() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUploadSellerListingPhotos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photos }: { id: string; photos: File[] }) =>
      uploadListingPhotos(id, photos),
    onSuccess: () => {
      toast.success('Photos uploaded');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.listings() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useCreateSellerPart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, photos }: { body: CreatePartInput; photos: File[] }) =>
      createPart(body, photos),
    onSuccess: () => {
      toast.success('Part listed');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.parts() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUpdateSellerPart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
      photos,
    }: {
      id: string;
      body: UpdatePartInput;
      photos: File[];
    }) => updatePart(id, body, photos),
    onSuccess: () => {
      toast.success('Part updated');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.parts() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useDeactivateSellerPart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivatePart(id),
    onSuccess: () => {
      toast.success('Part deactivated');
      void queryClient.invalidateQueries({ queryKey: sellerKeys.parts() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateSellerProfileInput) => updateSellerProfile(body),
    onSuccess: async () => {
      toast.success('Seller profile updated');
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      void queryClient.invalidateQueries({ queryKey: sellerKeys.profiles() });
      try {
        await refreshSession();
      } catch {
        // optional
      }
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useCreateSellerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateSellerProfileInput) => createSellerProfile(body),
    onSuccess: async () => {
      toast.success('Seller profile created');
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      void queryClient.invalidateQueries({ queryKey: sellerKeys.profiles() });
      try {
        await refreshSession();
      } catch {
        // optional
      }
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}
