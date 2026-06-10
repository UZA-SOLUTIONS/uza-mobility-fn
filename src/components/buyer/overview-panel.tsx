'use client';

import Link from 'next/link';
import { BuyerNextSteps } from '@/components/buyer/buyer-next-steps';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { workspaceRoutes } from '@/config/routes';
import { useMyOrders } from '@/queries/buyer';
import { useMyBookings } from '@/queries/bookings';
import { Car, List, ShoppingCart } from 'lucide-react';

export function BuyerOverviewPanel() {
  const { data: orders, isLoading: ordersLoading } = useMyOrders({
    limit: 1,
  });
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings({
    limit: 1,
    activeOnly: true,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Buyer overview"
        description="Track orders and bookings for your EV purchases."
      />

      <BuyerNextSteps />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Orders"
          value={orders?.meta.total}
          loading={ordersLoading}
          icon={ShoppingCart}
        />
        <StatCard
          title="Active bookings"
          value={bookings?.meta.total}
          loading={bookingsLoading}
          icon={Car}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link
              href={workspaceRoutes.accountBookings}
              className="flex items-center"
            >
              <Car className="size-4" />
              View bookings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={workspaceRoutes.accountOrders}
              className="flex items-center"
            >
              <List className="size-4" />
              View orders
            </Link>
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
  icon,
}: {
  title: string;
  value: number | undefined;
  loading: boolean;
  icon?: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 pb-2">
        {icon ? (
          <span className="text-muted-foreground">
            {(() => {
              const Icon = icon as React.ElementType;
              return <Icon className="size-5" />;
            })()}
          </span>
        ) : null}
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <p className="text-2xl font-semibold">{value ?? 0}</p>
        )}
      </CardContent>
    </Card>
  );
}
