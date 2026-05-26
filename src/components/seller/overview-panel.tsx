'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SellerStatusBanner } from '@/components/seller/seller-status-banner';
import { workspaceRoutes } from '@/config/routes';
import { useMyListings, useMyParts } from '@/queries/seller';

function countByStatus(listings: { status: string }[], statuses: string[]) {
  return listings.filter((l) => statuses.includes(l.status)).length;
}

export function SellerOverviewPanel() {
  const { data: listings, isLoading: listingsLoading } = useMyListings();
  const { data: parts, isLoading: partsLoading } = useMyParts();

  const draftCount = countByStatus(listings ?? [], ['DRAFT']);
  const pendingCount = countByStatus(listings ?? [], ['PENDING_REVIEW']);
  const liveCount = countByStatus(listings ?? [], ['APPROVED', 'PUBLISHED']);
  const rejectedCount = countByStatus(listings ?? [], ['REJECTED']);
  const activeParts = (parts ?? []).filter((p) => p.isActive).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Seller overview"
        description="Manage your vehicle listings, parts inventory, and seller profile."
      />

      <SellerStatusBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Draft listings"
          value={draftCount}
          loading={listingsLoading}
        />
        <StatCard
          title="Pending review"
          value={pendingCount}
          loading={listingsLoading}
        />
        <StatCard
          title="Live listings"
          value={liveCount}
          loading={listingsLoading}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          loading={listingsLoading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={workspaceRoutes.sellerListings}>Manage listings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={workspaceRoutes.sellerParts}>
              Manage parts ({partsLoading ? '…' : activeParts} active)
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={workspaceRoutes.sellerProfile}>Seller profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
