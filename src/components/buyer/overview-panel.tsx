'use client';

import Link from 'next/link';
import { BuyerNextSteps } from '@/components/buyer/buyer-next-steps';
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
import {
  ShoppingCart,
  FileText,
  CreditCard,
  DollarSign,
  List,
} from 'lucide-react';

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

      <BuyerNextSteps />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Orders"
          value={orders?.meta.total}
          loading={ordersLoading}
          icon={ShoppingCart}
        />
        <StatCard
          title="Invoices"
          value={invoices?.meta.total}
          loading={invoicesLoading}
          icon={FileText}
        />
        <StatCard
          title="Payments"
          value={payments?.meta.total}
          loading={paymentsLoading}
          icon={CreditCard}
        />
        <StatCard
          title="Financing requests"
          value={financing?.length}
          loading={financingLoading}
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link
              href={workspaceRoutes.accountInvoices}
              className="flex items-center"
            >
              <FileText className="size-4" />
              Request invoice
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
          <Button variant="outline" asChild>
            <Link
              href={workspaceRoutes.accountPayments}
              className="flex items-center"
            >
              <CreditCard className="size-4" />
              Submit payment
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={workspaceRoutes.accountFinancing}
              className="flex items-center"
            >
              <DollarSign className="size-4" />
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
              const Icon = icon as any;
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
