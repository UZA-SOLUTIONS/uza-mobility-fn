'use client';

import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { marketplaceMeSeller } from '@/lib/auth/seller-profiles';
import { canSellerTrade, sellerTradeBlockedMessage } from '@/lib/seller/trade';
import { useSessionUser } from '@/hooks/session-user';
import { workspaceRoutes } from '@/config/routes';
import { StatusBadge } from '@/components/shared/status-badge';

export function SellerStatusBanner() {
  const { user } = useSessionUser();
  const profile = marketplaceMeSeller(user);
  const blocked = sellerTradeBlockedMessage(profile);

  if (!profile) {
    return (
      <Alert>
        <AlertTitle>Seller profile required</AlertTitle>
        <AlertDescription className="flex flex-wrap items-center gap-3">
          <span>
            Set up your marketplace seller profile to list vehicles and parts.
          </span>
          <Button size="sm" variant="outline" asChild>
            <Link href={workspaceRoutes.sellerProfile}>Set up profile</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!blocked) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {profile.businessName}
        </span>
        <StatusBadge status={profile.status} />
        {profile.isVerified ? (
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-700 dark:text-emerald-400">
            Verified
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>Trading unavailable</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{blocked}</p>
        {profile.status === 'PENDING' ? (
          <p className="text-sm">
            You can still update your{' '}
            <Link
              href={workspaceRoutes.sellerProfile}
              className="font-medium underline underline-offset-4"
            >
              seller profile
            </Link>{' '}
            while we review your application.
          </p>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

export function useSellerCanTrade() {
  const { user } = useSessionUser();
  return canSellerTrade(marketplaceMeSeller(user));
}
