'use client';

import { AccountProfileForm } from '@/components/account/account-profile-form';
import { BuyerProfileForm } from '@/components/buyer/buyer-profile-form';
import { PageHeader } from '@/components/shared/page-header';
import { usePermissions } from '@/hooks/permissions';
import { workspaceRoutes } from '@/config/routes';
import Link from 'next/link';

export function BuyerProfilePanel() {
  const { hasSellerWorkspace } = usePermissions();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <PageHeader
        title="Profile"
        description="Your personal account and buyer details for purchases on UZA Mobility."
      />

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
