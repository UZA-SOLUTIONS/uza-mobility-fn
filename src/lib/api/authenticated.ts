'use client';

import { getSession } from 'next-auth/react';
import { refreshSession } from '@/lib/auth/session-update';
import type { AppSession } from '@/types/auth/session';
import { apiFetch } from './api';
import { ApiClientError } from './error';
import type { ApiRequestOptions } from './types';

type AuthenticatedOptions = ApiRequestOptions & {
  /** Internal: prevent infinite retry loops. */
  _retried?: boolean;
};

let refreshInFlight: Promise<AppSession | null | undefined> | null = null;

async function refreshSessionOnce() {
  if (!refreshInFlight) {
    refreshInFlight = refreshSession().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

/**
 * API call using the current session access token.
 * On 401, refreshes the session via NextAuth and retries once.
 */
export async function authenticatedFetch<T>(
  path: string,
  options: AuthenticatedOptions = {},
): Promise<T> {
  const { _retried, token: explicitToken, ...rest } = options;
  const session = await getSession();
  const token = explicitToken ?? session?.accessToken ?? null;

  if (!token) {
    throw new ApiClientError('Not authenticated', 401);
  }

  if (session?.error === 'RefreshAccessTokenError') {
    throw new ApiClientError('Session expired. Please sign in again.', 401);
  }

  try {
    return await apiFetch<T>(path, { ...rest, token });
  } catch (error) {
    const canRetry =
      !_retried &&
      error instanceof ApiClientError &&
      error.statusCode === 401 &&
      session?.refreshToken;

    if (!canRetry) {
      throw error;
    }

    const refreshed = await refreshSessionOnce();
    const nextToken =
      refreshed?.accessToken ?? (await getSession())?.accessToken;

    if (!nextToken || refreshed?.error === 'RefreshAccessTokenError') {
      throw new ApiClientError('Session expired. Please sign in again.', 401);
    }

    if (nextToken === token) {
      throw error;
    }

    return authenticatedFetch<T>(path, {
      ...rest,
      token: nextToken,
      _retried: true,
    });
  }
}
