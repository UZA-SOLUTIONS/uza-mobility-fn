'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { AuthPageHeader } from '@/components/auth/auth-page-header';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { Spinner } from '@/components/ui/spinner';
import { useVerifyEmail } from '@/queries/auth';
import { getAuthErrorMessage } from '@/lib/auth/auth-error-message';
import { authRoutes } from '@/config/routes';

type VerifyEmailFormProps = {
  token: string;
};

export function VerifyEmailForm({ token }: VerifyEmailFormProps) {
  const verify = useVerifyEmail();
  const attemptedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!token.trim() || attemptedToken.current === token) {
      return;
    }

    attemptedToken.current = token;
    verify.mutate({ token });
  }, [token]);

  if (!token.trim()) {
    return (
      <AuthFormCard>
        <div className="space-y-8">
          <AuthPageHeader
            title="Verify email"
            description="This verification link is invalid. Sign in and request a new verification email from your account."
          />
          <p className="text-center text-base text-[#5D6772]">
            <Link
              href={authRoutes.login}
              className="font-medium text-[#046A38] hover:underline"
            >
              Go to Sign in
            </Link>
          </p>
        </div>
      </AuthFormCard>
    );
  }

  if (verify.isPending) {
    return (
      <AuthFormCard>
        <div className="flex flex-col items-center gap-3 py-6">
          <Spinner className="size-6" />
          <p className="text-sm text-[#5D6772]">Verifying your email…</p>
        </div>
      </AuthFormCard>
    );
  }

  if (verify.isError) {
    return (
      <AuthFormCard>
        <div className="space-y-8">
          <AuthPageHeader title="Verification failed" />
          <AuthFormMessage
            variant="error"
            message={getAuthErrorMessage(
              verify.error,
              'This verification link is invalid or has expired.',
            )}
          />
          <p className="text-center text-base text-[#5D6772]">
            <Link
              href={authRoutes.login}
              className="font-medium text-[#046A38] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard>
      <div className="space-y-8">
        <AuthPageHeader
          title="Email verified"
          description={
            verify.data?.message ?? 'Your email address has been verified.'
          }
        />
        <AuthPrimaryButton asChild>
          <Link href={authRoutes.login}>Sign in to your account</Link>
        </AuthPrimaryButton>
      </div>
    </AuthFormCard>
  );
}
