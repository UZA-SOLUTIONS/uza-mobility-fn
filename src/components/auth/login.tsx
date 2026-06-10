'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { useLogin } from '@/queries/auth';
import { ApiClientError } from '@/lib/api';
import { authRoutes } from '@/config/routes';

export function Login() {
  const login = useLogin();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')?.trim() ?? '';

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onError: (error) => {
        const message =
          error instanceof ApiClientError
            ? error.message
            : 'Unable to sign in. Please try again.';
        form.setError('root', { message });
      },
    });
  });

  return (
    <AuthFormCard>
      <PageHeader
        title="Log in"
        description="Access your buyer or seller account."
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        {form.formState.errors.root ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
            {form.formState.errors.root.message
              ?.toLowerCase()
              .includes('verify your email') ? (
              <p className="text-sm text-muted-foreground">
                <Link
                  href={`${authRoutes.checkEmail}?email=${encodeURIComponent(form.getValues('email'))}`}
                  className="underline-offset-4 hover:underline"
                >
                  Resend verification email
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <GoogleSignInButton
        disabled={login.isPending}
        returnTo={callbackUrl.startsWith('/') ? callbackUrl : undefined}
        onError={(message) => form.setError('root', { message })}
      />
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={authRoutes.forgotPassword}
          className="underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
        {' · '}
        <Link
          href={authRoutes.register}
          className="underline-offset-4 hover:underline"
        >
          Create account
        </Link>
      </p>
    </AuthFormCard>
  );
}
