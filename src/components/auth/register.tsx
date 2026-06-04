'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterInput } from '@/schemas/auth';
import { useRegister } from '@/queries/auth';
import { ApiClientError } from '@/lib/api';
import { authRoutes } from '@/config/routes';

export function Register() {
  const register = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      preferredLanguage: 'en',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    register.mutate(values, {
      onError: (error) => {
        const message =
          error instanceof ApiClientError
            ? error.message
            : 'Unable to create account. Please try again.';
        form.setError('root', { message });
      },
    });
  });

  return (
    <AuthFormCard>
      <PageHeader
        title="Create account"
        description="Register as a buyer. Seller onboarding is available after sign-up."
      />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.firstName.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>
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
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...form.register('phone')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        {form.formState.errors.root ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
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
