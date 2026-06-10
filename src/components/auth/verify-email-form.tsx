'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useVerifyEmail } from '@/queries/auth';
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
        <PageHeader
          title="Verify email"
          description="This verification link is invalid. Sign in and request a new verification email from your account."
        />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={authRoutes.login}
            className="underline-offset-4 hover:underline"
          >
            Go to log in
          </Link>
        </p>
      </AuthFormCard>
    );
  }

  if (verify.isPending) {
    return (
      <AuthFormCard>
        <div className="flex flex-col items-center gap-3 py-6">
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground">Verifying your email…</p>
        </div>
      </AuthFormCard>
    );
  }

  if (verify.isError) {
    return (
      <AuthFormCard>
        <PageHeader
          title="Verification failed"
          description={
            verify.error instanceof Error
              ? verify.error.message
              : 'This verification link is invalid or has expired.'
          }
        />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={authRoutes.login}
            className="underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard>
      <PageHeader
        title="Email verified"
        description={
          verify.data?.message ?? 'Your email address has been verified.'
        }
      />
      <Button asChild className="w-full">
        <Link href={authRoutes.login}>Sign in to your account</Link>
      </Button>
    </AuthFormCard>
  );
}
