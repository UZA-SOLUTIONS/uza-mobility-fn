'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { workspaceRoutes } from '@/config/routes';
import {
  useMyFinancing,
  useMyInvoices,
  useMyOrders,
  useMyPayments,
} from '@/queries/buyer';

export function BuyerOverviewPanel() {
  const { data: orders, isLoading: ordersLoading } = useMyOrders({
    limit: 1,
  });
  const { data: invoices, isLoading: invoicesLoading } = useMyInvoices({
    limit: 1,
  });
  const { data: payments, isLoading: paymentsLoading } = useMyPayments({
    limit: 1,
  });
  const { data: financing, isLoading: financingLoading } = useMyFinancing();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Buyer overview"
        description="Track orders, invoices, payments, and financing for your EV purchases."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Orders"
          value={orders?.meta.total}
          loading={ordersLoading}
        />
        <StatCard
          title="Invoices"
          value={invoices?.meta.total}
          loading={invoicesLoading}
        />
        <StatCard
          title="Payments"
          value={payments?.meta.total}
          loading={paymentsLoading}
        />
        <StatCard
          title="Financing requests"
          value={financing?.length}
          loading={financingLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={workspaceRoutes.accountInvoices}>Request invoice</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={workspaceRoutes.accountOrders}>View orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={workspaceRoutes.accountPayments}>Submit payment</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={workspaceRoutes.accountFinancing}>
              Financing support
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
}: {
  title: string;
  value: number | undefined;
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
          <p className="text-2xl font-semibold">{value ?? 0}</p>
        )}
      </CardContent>
    </Card>
  );
}
