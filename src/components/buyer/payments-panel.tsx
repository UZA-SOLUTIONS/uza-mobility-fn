'use client';

import { useState } from 'react';
import { SubmitPaymentDialog } from '@/components/buyer/submit-payment-dialog';
import { StatusBadge } from '@/components/admin/shared/status-badge';
import { PaginationBar } from '@/components/admin/shared/pagination-bar';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatUsd } from '@/lib/admin/format';
import { useMyPayments } from '@/queries/buyer';
import type { BuyerPaymentsFilters } from '@/types/buyer/commerce';

export function BuyerPaymentsPanel() {
  const [filters, setFilters] = useState<BuyerPaymentsFilters>({
    page: 1,
    limit: 20,
  });
  const [submitOpen, setSubmitOpen] = useState(false);

  const { data, isLoading, isError, error } = useMyPayments(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="My payments"
          description="Payment proofs you submitted for invoice settlement."
        />
        <Button onClick={() => setSubmitOpen(true)}>Submit payment</Button>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load payments'}
        </p>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {!isLoading && (data?.items.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No payment submissions yet.
                </TableCell>
              </TableRow>
            ) : null}
            {data?.items.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {formatUsd(payment.amountPaid)} {payment.currency}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.meta ? (
        <PaginationBar
          meta={data.meta}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      ) : null}

      <SubmitPaymentDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </div>
  );
}
