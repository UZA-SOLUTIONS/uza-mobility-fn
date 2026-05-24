'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePermissions } from '@/hooks/permissions';
import { PageHeader } from '@/components/shared/page-header';
import { PaginationBar } from '@/components/admin/shared/pagination-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useActivatePart,
  useAdminParts,
  useDeactivatePart,
} from '@/queries/admin';
import type { AdminPart, AdminPartsFilters } from '@/types/admin/marketplace';

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function PartActions({ part }: { part: AdminPart }) {
  const { can } = usePermissions();
  const activate = useActivatePart();
  const deactivate = useDeactivatePart();
  const busy = activate.isPending || deactivate.isPending;

  if (!can('parts:manage')) {
    return null;
  }

  return part.isActive ? (
    <Button
      size="sm"
      variant="outline"
      disabled={busy}
      onClick={() => deactivate.mutate(part.id)}
    >
      Deactivate
    </Button>
  ) : (
    <Button size="sm" disabled={busy} onClick={() => activate.mutate(part.id)}>
      Activate
    </Button>
  );
}

export function AdminPartsPanel() {
  const [filters, setFilters] = useState<AdminPartsFilters>({
    page: 1,
    limit: 24,
  });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const queryFilters: AdminPartsFilters = {
    ...filters,
    q: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, error } = useAdminParts(queryFilters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parts"
        description="Browse the parts catalog and activate or deactivate listings."
      />

      <div className="space-y-1.5 sm:max-w-sm">
        <Label htmlFor="parts-search">Search</Label>
        <Input
          id="parts-search"
          placeholder="Name or description…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setFilters((current) => ({ ...current, page: 1 }));
          }}
        />
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load parts.'}
        </p>
      ) : null}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((__, cell) => (
                      <TableCell key={cell}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
            {!isLoading && data?.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  No parts found.
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading
              ? data?.items.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <div className="font-medium">{part.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {part.slug}
                      </div>
                    </TableCell>
                    <TableCell>{part.categorySlug}</TableCell>
                    <TableCell>{part.condition.replaceAll('_', ' ')}</TableCell>
                    <TableCell>{formatUsd(part.priceUsd)}</TableCell>
                    <TableCell>{part.stockQuantity}</TableCell>
                    <TableCell>
                      <Badge variant={part.isActive ? 'default' : 'secondary'}>
                        {part.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PartActions part={part} />
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>

      {data?.meta ? (
        <PaginationBar
          meta={data.meta}
          onPageChange={(page) =>
            setFilters((current) => ({ ...current, page }))
          }
        />
      ) : null}
    </div>
  );
}
