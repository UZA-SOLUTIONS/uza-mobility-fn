'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/queries/admin';

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const { data, isLoading, isError, error } = useDashboard(true);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Overview"
          description="Platform metrics for administrators."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <PageHeader title="Overview" />
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : 'Unable to load dashboard metrics.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Live counts from listings, orders, payments, fleet, financing, and sustainability."
      />

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Operations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Published listings"
            value={formatNumber(data.listings.total)}
          />
          <MetricCard
            label="Pending review"
            value={formatNumber(data.listings.pendingReview)}
            hint="Awaiting moderation"
          />
          <MetricCard
            label="Total orders"
            value={formatNumber(data.orders.total)}
          />
          <MetricCard
            label="Payments to verify"
            value={formatNumber(data.payments.pendingVerification)}
          />
          <MetricCard
            label="Active fleet requests"
            value={formatNumber(data.fleet.active)}
          />
          <MetricCard
            label="Financing in progress"
            value={formatNumber(data.financing.pending)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Sustainability impact
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="EVs delivered"
            value={formatNumber(data.impact.evsDelivered)}
          />
          <MetricCard
            label="CO₂ avoided (kg)"
            value={formatNumber(Math.round(data.impact.co2AvoidedKg))}
          />
          <MetricCard
            label="Fuel saved (L)"
            value={formatNumber(Math.round(data.impact.fuelSavedLitres))}
          />
          <MetricCard
            label="Trees equivalent"
            value={formatNumber(data.impact.treesEquivalent)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {data.impact.methodologyNote}
        </p>
      </section>
    </div>
  );
}
