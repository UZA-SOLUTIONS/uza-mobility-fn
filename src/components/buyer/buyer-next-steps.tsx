'use client';

import Link from 'next/link';
import { AlertCircle, CreditCard, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { workspaceRoutes } from '@/config/routes';
import {
  isPayableInvoiceStatus,
  PAYMENT_REVIEW_INVOICE_STATUSES,
} from '@/lib/buyer/invoice-flow';
import { useMyInvoices, useMyPayments } from '@/queries/buyer';

export function BuyerNextSteps() {
  const { data: payableInvoices } = useMyInvoices({
    payableOnly: true,
    limit: 5,
  });
  const { data: pendingInvoices } = useMyInvoices({
    pendingPurchase: true,
    limit: 10,
  });
  const { data: payments } = useMyPayments({
    status: 'UNDER_VERIFICATION',
    limit: 5,
  });

  const payableCount = payableInvoices?.meta.total ?? 0;
  const firstPayable = payableInvoices?.items.find((invoice) =>
    isPayableInvoiceStatus(invoice.status),
  );
  const underReviewInvoices =
    pendingInvoices?.items.filter((invoice) =>
      PAYMENT_REVIEW_INVOICE_STATUSES.includes(invoice.status),
    ) ?? [];
  const underReviewPayments = payments?.items ?? [];
  const hasReviewState =
    underReviewInvoices.length > 0 || underReviewPayments.length > 0;

  if (payableCount === 0 && !hasReviewState) {
    return null;
  }

  return (
    <div className="space-y-3">
      {payableCount > 0 && firstPayable ? (
        <Alert>
          <FileText className="size-4" />
          <AlertTitle>
            {payableCount === 1
              ? 'Invoice awaiting payment'
              : `${payableCount} invoices awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {firstPayable.invoiceNumber} · {firstPayable.vehicleBrand}{' '}
              {firstPayable.vehicleModel}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountPayments}?invoiceId=${firstPayable.id}`}
              >
                Submit payment
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={workspaceRoutes.accountInvoices}>View invoices</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {hasReviewState ? (
        <Alert>
          <CreditCard className="size-4" />
          <AlertTitle>Payment under review</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              We are verifying your payment
              {underReviewInvoices[0]
                ? ` for invoice ${underReviewInvoices[0].invoiceNumber}`
                : ''}
              . You will be notified when it is confirmed and your order is
              created.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={workspaceRoutes.accountPayments}>View payments</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <Alert>
        <AlertCircle className="size-4" />
        <AlertDescription className="text-sm">
          Need financing help?{' '}
          <Link
            href={workspaceRoutes.accountFinancing}
            className="font-medium underline underline-offset-4"
          >
            Request financing support
          </Link>
          .
        </AlertDescription>
      </Alert>
    </div>
  );
}
