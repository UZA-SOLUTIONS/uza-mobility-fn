'use client';

import { useState } from 'react';
import { RequestInvoiceDialog } from '@/components/buyer/request-invoice-dialog';
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
import { formatUsd } from '@/lib/admin/format';
import { useMyInvoices, useOpenInvoiceDocument } from '@/queries/buyer';
import type { BuyerInvoicesFilters } from '@/types/buyer/commerce';

export function BuyerInvoicesPanel() {
  const [filters, setFilters] = useState<BuyerInvoicesFilters>({
    page: 1,
    limit: 20,
  });
  const [requestOpen, setRequestOpen] = useState(false);
  const openDoc = useOpenInvoiceDocument();

  const { data, isLoading, isError, error } = useMyInvoices(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="My invoices"
          description="Proforma and payment invoices for your purchases."
        />
        <Button onClick={() => setRequestOpen(true)}>Request invoice</Button>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load invoices'}
        </p>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {!isLoading && (data?.items.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No invoices yet.
                </TableCell>
              </TableRow>
            ) : null}
            {data?.items.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Ref {invoice.paymentReference}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {invoice.vehicleBrand} {invoice.vehicleModel}
                </TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell>{formatUsd(invoice.totalAmountUsd)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={openDoc.isPending}
                    onClick={() => openDoc.mutate(invoice.id)}
                  >
                    View document
                  </Button>
                </TableCell>
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

      <RequestInvoiceDialog open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
}
