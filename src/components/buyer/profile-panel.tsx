'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AccountProfileForm } from '@/components/account/account-profile-form';
import { BuyerProfileForm } from '@/components/buyer/buyer-profile-form';
import { PageHeader } from '@/components/shared/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/permissions';
import { workspaceRoutes } from '@/config/routes';

export function BuyerProfilePanel() {
  const { hasSellerWorkspace } = usePermissions();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <PageHeader
        title="Profile"
        description="Your personal account and buyer details for purchases on UZA Mobility."
      />

      {returnTo?.startsWith('/') ? (
        <Alert>
          <AlertTitle>Complete your buyer profile</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              Finish your buyer details to continue with your vehicle
              reservation.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={returnTo}>Continue purchase</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {hasSellerWorkspace ? (
        <p className="text-sm text-muted-foreground">
          You also sell on the marketplace. Manage listings in the{' '}
          <Link
            href={workspaceRoutes.seller}
            className="font-medium text-foreground underline underline-offset-4"
          >
            seller workspace
          </Link>
          .
        </p>
      ) : null}

      <AccountProfileForm showHeading={false} />

      <section className="space-y-4 border-t pt-8">
        <h2 className="text-lg font-semibold">Buyer details</h2>
        <BuyerProfileForm />
      </section>
    </div>
  );
}
