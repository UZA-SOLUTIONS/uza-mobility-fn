'use client';

import { useSession } from 'next-auth/react';
import { useMe } from '@/queries/auth';

export function useSessionUser() {
  const { data: session, status } = useSession();
  const meQuery = useMe();
  const sessionExpired = session?.error === 'RefreshAccessTokenError';

  return {
    user: sessionExpired ? null : (meQuery.data ?? session?.user ?? null),
    accessToken: sessionExpired ? null : (session?.accessToken ?? null),
    isAuthenticated: status === 'authenticated' && !sessionExpired,
    isLoading: status === 'loading' || meQuery.isFetching,
    refetch: meQuery.refetch,
    sessionExpired,
  };
}
