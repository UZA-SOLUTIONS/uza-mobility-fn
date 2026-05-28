'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';
import {
  useMyChargingStations,
  useMyOperatorProfile,
} from '@/queries/operator';

export function OperatorOverviewPanel() {
  const { hasOperatorWorkspace } = usePermissions();
  const profile = useMyOperatorProfile();
  const stations = useMyChargingStations({ page: 1, limit: 1 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Charging operator"
        description="Manage your operator profile and charging stations."
      />

      {!hasOperatorWorkspace ? (
        <Card>
          <CardHeader>
            <CardTitle>Apply to become a charging operator</CardTitle>
            <CardDescription>
              You can submit your company details from the profile page. If you
              already applied, your request may still be under review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={workspaceRoutes.operatorProfile}>Open profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Operator status</CardDescription>
            <CardTitle>
              {profile.data?.status ?? (profile.isError ? 'Unavailable' : '—')}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Stations</CardDescription>
            <CardTitle>{stations.data?.meta.total ?? '—'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Quick action</CardDescription>
            <CardTitle className="text-sm font-medium">
              Create and submit station drafts
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
