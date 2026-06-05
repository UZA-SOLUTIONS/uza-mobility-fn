'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppRouter } from '@/lib/navigation/use-app-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { signOutClient } from '@/lib/auth/sign-out-client';
import { useLogout } from '@/queries/auth';
import { usePermissions } from '@/hooks/permissions';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { authRedirect } from '@/lib/auth/redirect';
import { hasBuyerWorkspace } from '@/lib/permissions';
import { isMeUser } from '@/types/auth/me-user';

type BuyerAccessProps = {
  children: React.ReactNode;
};

export function BuyerAccess({ children }: BuyerAccessProps) {
  const router = useAppRouter();
  const queryClient = useQueryClient();
  const logout = useLogout();
  const { data: session, status } = useSession();
  const {
    user,
    isLoading,
    hasSellerWorkspace,
    hasAdminAccess,
    hasOperatorWorkspace,
    hasOperatorApplication,
  } = usePermissions();

  const sessionUser = isMeUser(session?.user) ? session.user : null;
  const effectiveUser = user ?? sessionUser;
  const permissions =
    effectiveUser?.permissions ?? sessionUser?.permissions ?? [];
  const roles = effectiveUser?.roles ?? sessionUser?.roles ?? [];
  const canAccessBuyer = hasBuyerWorkspace(permissions, roles);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      void signOutClient({ queryClient, callbackUrl: authRoutes.login });
    }
  }, [queryClient, session?.error]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      const login = `${authRoutes.login}?callbackUrl=${encodeURIComponent(workspaceRoutes.account)}`;
      router.replace(login);
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated' || canAccessBuyer || !effectiveUser) {
      return;
    }
    router.replace(authRedirect(effectiveUser));
  }, [status, canAccessBuyer, effectiveUser, router]);

  if (
    (status === 'loading' && !effectiveUser) ||
    (isLoading && !effectiveUser)
  ) {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!canAccessBuyer) {
    return (
      <div className="flex h-dvh items-center justify-center overflow-hidden bg-background p-6">
        <div className="mx-auto max-w-lg space-y-4 rounded-lg border bg-card p-6">
          <h1 className="text-lg font-semibold">Buyer access required</h1>
          <p className="text-sm text-muted-foreground">
            {effectiveUser?.email
              ? `Signed in as ${effectiveUser.email}, but this account does not have buyer permissions. Try another workspace or sign out and use a buyer account.`
              : 'This area is for buyers. Sign in with a buyer account to continue.'}
          </p>
          <div className="flex flex-wrap gap-2">
            {hasSellerWorkspace ? (
              <Button asChild>
                <Link href={workspaceRoutes.seller}>Seller workspace</Link>
              </Button>
            ) : null}
            {hasAdminAccess ? (
              <Button asChild variant="outline">
                <Link href={workspaceRoutes.admin}>Admin workspace</Link>
              </Button>
            ) : null}
            {hasOperatorWorkspace || hasOperatorApplication ? (
              <Button asChild variant="outline">
                <Link href={workspaceRoutes.operator}>
                  {hasOperatorWorkspace
                    ? 'Operator workspace'
                    : 'Charging operator application'}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href={workspaceRoutes.operator}>
                  Become a charging operator
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
