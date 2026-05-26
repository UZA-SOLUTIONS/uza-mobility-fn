'use client';

import { useState } from 'react';
import { FinancingRequestDialog } from '@/components/buyer/financing-request-dialog';
import { StatusBadge } from '@/components/admin/shared/status-badge';
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
import { useMyFinancing } from '@/queries/buyer';

export function BuyerFinancingPanel() {
  const [requestOpen, setRequestOpen] = useState(false);
  const { data, isLoading, isError, error } = useMyFinancing();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Financing support"
          description="Track facilitation requests submitted to UZA and partner banks."
        />
        <Button onClick={() => setRequestOpen(true)}>New request</Button>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load requests'}
        </p>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deposit</TableHead>
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
            {!isLoading && (data?.length ?? 0) === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No financing requests yet.
                </TableCell>
              </TableRow>
            ) : null}
            {data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.buyerName}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  {row.preferredDepositUsd != null
                    ? formatUsd(row.preferredDepositUsd)
                    : '—'}
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FinancingRequestDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </div>
  );
}
