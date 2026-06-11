'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { AuthPageHeader } from '@/components/auth/auth-page-header';
import { Spinner } from '@/components/ui/spinner';
import { authRoutes } from '@/config/routes';
import { ApiClientError } from '@/lib/api';
import { resolvePostLoginRedirect } from '@/lib/auth/redirect';
import { signInWithSession } from '@/lib/auth/sign-in';
import { normalizeMeUser } from '@/lib/auth/seller-profiles';
import { useAppRouter } from '@/lib/navigation/use-app-router';
import { clearUserSessionQueries } from '@/lib/query/clear-user-session';
import { completeGoogleSignIn, getMe } from '@/lib/api/auth';
import { useQueryClient } from '@tanstack/react-query';

export function GoogleCallback() {
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const exchangeCode = searchParams.get('code')?.trim() ?? '';
  const returnTo = searchParams.get('returnTo')?.trim() ?? '';
  const callbackError = searchParams.get('error')?.trim() ?? '';

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (callbackError) {
      setError(callbackError);
      return;
    }

    if (!exchangeCode) {
      setError('Missing Google sign-in code. Please try again.');
      return;
    }

    void (async () => {
      try {
        const tokens = await completeGoogleSignIn(exchangeCode);
        const me = normalizeMeUser(await getMe(tokens.accessToken));
        const result = await signInWithSession(tokens);

        if (!result || result.error) {
          throw new ApiClientError(
            'Unable to start session after Google sign-in. Please try again.',
            500,
          );
        }

        clearUserSessionQueries(queryClient);
        router.replace(
          resolvePostLoginRedirect(
            me,
            returnTo.startsWith('/') ? returnTo : null,
          ),
        );
        router.refresh();
      } catch (err) {
        setError(
          err instanceof ApiClientError
            ? err.message
            : 'Unable to complete Google sign-in. Please try again.',
        );
      }
    })();
  }, [callbackError, exchangeCode, queryClient, returnTo, router]);

  if (error) {
    return (
      <AuthFormCard>
        <div className="space-y-6">
          <AuthPageHeader title="Google sign-in failed" />
          <AuthFormMessage variant="error" message={error} />
          <Link
            href={authRoutes.login}
            className="block text-center text-sm font-medium text-[#046A38] hover:underline"
          >
            Back to Sign in
          </Link>
        </div>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard>
      <div className="flex flex-col items-center gap-3 py-8">
        <Spinner className="size-6" />
        <p className="text-sm text-[#5D6772]">Completing Google sign-in…</p>
      </div>
    </AuthFormCard>
  );
}
