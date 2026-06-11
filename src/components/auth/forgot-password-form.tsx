'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFieldError } from '@/components/auth/auth-field-error';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { AuthFormMessage } from '@/components/auth/auth-form-message';
import { AuthPageHeader } from '@/components/auth/auth-page-header';
import { AuthPrimaryButton } from '@/components/auth/auth-primary-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/auth';
import { useForgotPassword } from '@/queries/auth';
import { getAuthErrorMessage } from '@/lib/auth/auth-error-message';
import { useClearAuthFeedbackOnChange } from '@/hooks/use-auth-form-lifecycle';
import { authRoutes } from '@/config/routes';

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  const messageRef = useRef<HTMLDivElement>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const { errors } = useFormState({ control: form.control });

  useClearAuthFeedbackOnChange(form, forgot, ['email']);

  const rootMessage =
    errors.root?.message ??
    (forgot.isError
      ? getAuthErrorMessage(
          forgot.error,
          'Unable to send reset instructions. Please try again.',
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
    forgot.reset();
    forgot.mutate(values, {
      onSuccess: (response) => {
        form.setError('root', {
          type: 'success',
          message: response.message,
        });
      },
      onError: (error) => {
        form.setError('root', {
          message: getAuthErrorMessage(
            error,
            'Unable to send reset instructions. Please try again.',
          ),
        });
      },
    });
  });

  return (
    <AuthFormCard>
      <div className="space-y-8">
        <AuthPageHeader
          title="Reset your password"
          description="Enter your email address and we'll send you a link to reset your password"
        />

        <form onSubmit={onSubmit} className="space-y-7">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-normal text-[#151515]"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="e.g., name@company.com"
              className="auth-input h-11 rounded border-[#E9E9E9] bg-white px-[18px] placeholder:text-[#356769]/75"
              aria-invalid={Boolean(errors.email)}
              {...form.register('email')}
            />
            <AuthFieldError message={errors.email?.message} />
          </div>

          {rootMessage ? (
            <div ref={messageRef}>
              <AuthFormMessage
                variant={isSuccess ? 'success' : 'error'}
                message={rootMessage}
              />
            </div>
          ) : null}

          <AuthPrimaryButton type="submit" disabled={forgot.isPending}>
            {forgot.isPending ? 'Sending…' : 'Send reset link'}
          </AuthPrimaryButton>
        </form>

        <p className="text-center text-base text-[#5D6772]">
          Back to{' '}
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
