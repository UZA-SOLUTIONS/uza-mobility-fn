'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFieldError } from '@/components/auth/auth-field-error';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { AuthPageHeader } from '@/components/auth/auth-page-header';
import { AuthPasswordInput } from '@/components/auth/auth-password-input';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { resetPasswordSchema, type ResetPasswordInput } from '@/schemas/auth';
import { useResetPassword } from '@/queries/auth';
import { getAuthErrorMessage } from '@/lib/auth/auth-error-message';
import {
  useAuthQueryReset,
  useClearAuthFeedbackOnChange,
} from '@/hooks/use-auth-form-lifecycle';
import { authRoutes } from '@/config/routes';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const reset = useResetPassword();
  const messageRef = useRef<HTMLDivElement>(null);
  const queryKey = token.trim();

  const defaultValues = useMemo<ResetPasswordInput>(
    () => ({
      token: queryKey,
      password: '',
    }),
    [queryKey],
  );

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
  });
  const { errors } = useFormState({ control: form.control });

  useAuthQueryReset(form, reset, queryKey, defaultValues);
  useClearAuthFeedbackOnChange(form, reset, ['password']);

  const rootMessage =
    errors.root?.message ??
    (reset.isError
      ? getAuthErrorMessage(
          reset.error,
          'Unable to reset password. Please try again.',
        )
      : null);
  const isSuccess = errors.root?.type === 'success';

  useEffect(() => {
    if (rootMessage) {
      messageRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [rootMessage]);

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors('root');
    reset.reset();
    reset.mutate(values, {
      onSuccess: (response) => {
        form.reset({ token: values.token, password: '' });
        form.setError('root', {
          type: 'success',
          message: `${response.message} You can now sign in.`,
        });
      },
      onError: (error) => {
        form.setError('root', {
          message: getAuthErrorMessage(
            error,
            'Unable to reset password. Please try again.',
          ),
        });
      },
    });
  });

  if (!queryKey) {
    return (
      <AuthFormCard>
        <div className="space-y-8">
          <AuthPageHeader
            title="Reset your password"
            description="This reset link is invalid. Request a new one from the forgot password page."
          />
          <p className="text-center text-base text-[#5D6772]">
            <Link
              href={authRoutes.forgotPassword}
              className="font-medium text-[#046A38] hover:underline"
            >
              Request a new reset link
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
          title="Reset your password"
          description="Choose a new password for your account."
        />

        <form onSubmit={onSubmit} className="space-y-6">
          <input type="hidden" {...form.register('token')} />
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-normal text-[#151515]"
            >
              New password
            </label>
            <AuthPasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Enter password"
              aria-invalid={Boolean(errors.password)}
              {...form.register('password')}
            />
            <AuthFieldError message={errors.password?.message} />
          </div>

          {rootMessage ? (
            <div ref={messageRef}>
              <AuthFormMessage
                variant={isSuccess ? 'success' : 'error'}
                message={rootMessage}
              />
            </div>
          ) : null}

          <AuthPrimaryButton
            type="submit"
            disabled={reset.isPending || isSuccess}
          >
            {reset.isPending ? 'Updating…' : 'Update password'}
          </AuthPrimaryButton>
        </form>

        <p className="text-center text-base text-[#5D6772]">
          {isSuccess ? (
            <Link
              href={authRoutes.login}
              className="font-medium text-[#046A38] hover:underline"
            >
              Sign in with your new password
            </Link>
          ) : (
            <>
              Back to{' '}
              <Link
                href={authRoutes.login}
                className="font-medium text-[#046A38] hover:underline"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </AuthFormCard>
  );
}
