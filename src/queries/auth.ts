'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, logout, register } from '@/lib/api/auth';
import { authenticatedFetch } from '@/lib/api/authenticated';
import { ApiClientError } from '@/lib/api';
import { authRoutes } from '@/config/routes';
import { signInWithSession } from '@/lib/auth/sign-in';
import { authRedirect } from '@/lib/auth/redirect';
import { normalizeMeUser } from '@/lib/auth/seller-profiles';
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};
import type { LoginInput, RegisterInput } from '@/schemas/auth';
import type { MeUser } from '@/types/auth/me-user';
import { isMeUser } from '@/types/auth/me-user';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const tokens = await login(input);
      const result = await signInWithSession({
        ...tokens,
        email: input.email,
        password: input.password,
      });

      if (!result || result.error) {
        throw new ApiClientError(
          'Unable to start session after login. Please try again.',
          500,
        );
      }

      return result;
    },
    onSuccess: async () => {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl && callbackUrl.startsWith('/')) {
        router.replace(callbackUrl);
        router.refresh();
        return;
      }

      const session = await getSession();

      if (isMeUser(session?.user)) {
        router.replace(authRedirect(session.user));
      } else {
        router.replace('/account');
      }

      router.refresh();
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const tokens = await register(input);
      const result = await signInWithSession({
        ...tokens,
        email: input.email,
        password: input.password,
      });

      if (!result || result.error) {
        throw new ApiClientError(
          'Account created but session could not be started. Please log in.',
          500,
        );
      }

      return result;
    },
    onSuccess: async () => {
      const session = await getSession();

      if (isMeUser(session?.user)) {
        router.replace(authRedirect(session.user));
      } else {
        router.replace('/account');
      }

      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async () => {
      if (session?.refreshToken) {
        try {
          await logout(session.refreshToken);
        } catch {
          // Still sign out locally if API logout fails
        }
      }
    },
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      await signOut({ redirect: false });
      router.replace(authRoutes.login);
      router.refresh();
    },
  });
}

export function useMe() {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () =>
      normalizeMeUser(await authenticatedFetch<MeUser>('/auth/me')),
    enabled:
      status === 'authenticated' &&
      session?.error !== 'RefreshAccessTokenError',
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
