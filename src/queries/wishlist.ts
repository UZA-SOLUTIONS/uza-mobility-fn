'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  addToWishlist,
  getWishlistIds,
  removeFromWishlist,
} from '@/lib/api/marketplace';
import { authenticatedFetch } from '@/lib/api/authenticated';
import type { PublicListing } from '@/types/marketplace/public-listing';

export const wishlistKeys = {
  all: ['wishlist'] as const,
  ids: () => [...wishlistKeys.all, 'ids'] as const,
  list: () => [...wishlistKeys.all, 'list'] as const,
};

export function useWishlistIds() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: wishlistKeys.ids(),
    queryFn: () => getWishlistIds(accessToken!),
    enabled:
      status === 'authenticated' &&
      Boolean(accessToken) &&
      session?.error !== 'RefreshAccessTokenError',
    staleTime: 30_000,
  });
}

export function useWishlist() {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;

  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: () =>
      authenticatedFetch<PublicListing[]>('/listings/wishlist', {
        token: accessToken,
      }),
    enabled:
      status === 'authenticated' &&
      Boolean(accessToken) &&
      session?.error !== 'RefreshAccessTokenError',
    staleTime: 30_000,
  });
}

export function useToggleWishlist(listingId: string) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  return useMutation({
    mutationFn: async (saved: boolean) => {
      if (!accessToken) {
        throw new Error('Sign in to save vehicles');
      }

      if (saved) {
        return removeFromWishlist(listingId, accessToken);
      }

      return addToWishlist(listingId, accessToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
