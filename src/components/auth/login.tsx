'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFieldError } from '@/components/auth/auth-field-error';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { AuthPageHeader } from '@/components/auth/auth-page-header';
import { AuthPasswordInput } from '@/components/auth/auth-password-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import {
  authAccentLinkClassName,
  authFieldClassName,
  authFooterLinkClassName,
  authInputClassName,
  authLabelClassName,
} from '@/components/auth/auth-styles';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { useLogin } from '@/queries/auth';
import { getAuthErrorMessage } from '@/lib/auth/auth-error-message';
import { getLoginDefaultValues } from '@/lib/auth/login-default-values';
import {
  useAuthQueryReset,
  useClearAuthFeedbackOnChange,
} from '@/hooks/use-auth-form-lifecycle';
import { authRoutes } from '@/config/routes';

export function Login() {
  const login = useLogin();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')?.trim() ?? '';
  const queryKey = searchParams.toString();
  const errorRef = useRef<HTMLDivElement>(null);

  const defaultValues = useMemo(
    () => getLoginDefaultValues(searchParams),
    [queryKey, searchParams],
  );

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });
  const { errors } = useFormState({ control: form.control });

  useAuthQueryReset(form, login, queryKey, defaultValues);
  useClearAuthFeedbackOnChange(form, login, ['email', 'password']);

  const rootMessage =
    errors.root?.message ??
    (login.isError
      ? getAuthErrorMessage(login.error, 'Unable to sign in. Please try again.')
      : null);

  useEffect(() => {
    if (rootMessage) {
      errorRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [rootMessage]);

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors('root');
    login.reset();
    login.mutate(values, {
      onError: (error) => {
        form.setError('root', {
          message: getAuthErrorMessage(
            error,
            'Unable to sign in. Please try again.',
          ),
        });
      },
    });
  });

  return (
    <AuthFormCard>
      <div className="space-y-4">
        <AuthPageHeader title="Welcome back" description="Log in to continue" />

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2.5">
            <div className={authFieldClassName}>
              <Label htmlFor="email" className={authLabelClassName}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={authInputClassName}
                aria-invalid={Boolean(errors.email)}
                {...form.register('email')}
              />
              <AuthFieldError message={errors.email?.message} />
            </div>

            <div className={authFieldClassName}>
              <Label htmlFor="password" className={authLabelClassName}>
                Password
              </Label>
              <AuthPasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Enter password"
                aria-invalid={Boolean(errors.password)}
                {...form.register('password')}
              />
              <AuthFieldError message={errors.password?.message} />
            </div>

            <div className="flex justify-end">
              <Link
                href={authRoutes.forgotPassword}
                className="text-xs text-[#356769] hover:text-[#174438] sm:text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {rootMessage ? (
            <div ref={errorRef}>
              <AuthFormMessage variant="error" message={rootMessage}>
                {rootMessage.toLowerCase().includes('verify your email') ? (
                  <p className="text-sm text-red-800/90">
                    <Link
                      href={`${authRoutes.checkEmail}?email=${encodeURIComponent(form.getValues('email'))}`}
                      className="font-medium underline underline-offset-2"
                    >
                      Resend verification email
                    </Link>
                  </p>
                ) : null}
              </AuthFormMessage>
            </div>
          ) : null}

          <div className="space-y-2">
            <AuthPrimaryButton type="submit" disabled={login.isPending}>
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </AuthPrimaryButton>
            <GoogleSignInButton
              disabled={login.isPending}
              returnTo={callbackUrl.startsWith('/') ? callbackUrl : undefined}
              onError={(message) => form.setError('root', { message })}
            />
          </div>
        </form>

        <p className={authFooterLinkClassName}>
          Don&apos;t have an account?{' '}
          <Link href={authRoutes.register} className={authAccentLinkClassName}>
            Register here
          </Link>
        </p>
      </div>
    </AuthFormCard>
  );
}
