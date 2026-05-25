'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePermissions } from '@/hooks/permissions';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';
import { PartDetailSheet } from '@/components/admin/part-detail-sheet';
import { PartFormDialog } from '@/components/admin/part-form-dialog';
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
  useDeletePart,
} from '@/queries/admin';
import type { AdminPart, AdminPartsFilters } from '@/types/admin/marketplace';

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function PartActions({
  part,
  onView,
  onEdit,
  onDelete,
  busy,
}: {
  part: AdminPart;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const { can } = usePermissions();

  if (!can('parts:manage')) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1">
      <Button size="sm" variant="outline" disabled={busy} onClick={onView}>
        View
      </Button>
      <Button size="sm" variant="ghost" disabled={busy} onClick={onEdit}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={busy}
        onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  );
}

export function AdminPartsPanel() {
  const [filters, setFilters] = useState<AdminPartsFilters>({
    page: 1,
    limit: 24,
  });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<AdminPart | null>(null);
  const [viewingPartId, setViewingPartId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminPart | null>(null);
  const deletePart = useDeletePart();
  const activate = useActivatePart();
  const deactivate = useDeactivatePart();
  const actionsBusy =
    deletePart.isPending || activate.isPending || deactivate.isPending;

  const queryFilters: AdminPartsFilters = {
    ...filters,
    q: debouncedSearch || undefined,
  };

  const { data, isLoading, isError, error } = useAdminParts(queryFilters);

  const openCreate = () => {
    setEditingPart(null);
    setFormOpen(true);
  };

  const openEdit = (part: AdminPart) => {
    setEditingPart(part);
    setFormOpen(true);
  };

  const openDetail = (part: AdminPart) => {
    setViewingPartId(part.id);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Parts"
          description="Create, edit, and remove parts in the marketplace catalog."
        />
        <Button onClick={openCreate}>New part</Button>
      </div>

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
              <TableHead className="w-14" />
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
                    {Array.from({ length: 8 }).map((__, cell) => (
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
                  colSpan={8}
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
                      {(() => {
                        const primary =
                          part.photos?.find((p) => p.isPrimary) ??
                          part.photos?.[0];
                        if (!primary) {
                          return (
                            <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                              —
                            </div>
                          );
                        }
                        return (
                          <button
                            type="button"
                            className="relative block h-10 w-10 overflow-hidden rounded border"
                            onClick={() => openDetail(part)}
                          >
                            <Image
                              src={primary.url}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized
                            />
                          </button>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{part.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {part.slug}
                        {part.seller?.businessName
                          ? ` · ${part.seller.businessName}`
                          : ''}
                      </div>
                    </TableCell>
                    <TableCell>{part.categorySlug}</TableCell>
                    <TableCell>{part.condition}</TableCell>
                    <TableCell>{formatUsd(part.priceUsd)}</TableCell>
                    <TableCell>{part.stockQuantity}</TableCell>
                    <TableCell>
                      <Badge variant={part.isActive ? 'default' : 'secondary'}>
                        {part.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <PartActions
                        part={part}
                        busy={actionsBusy}
                        onView={() => openDetail(part)}
                        onEdit={() => openEdit(part)}
                        onDelete={() => setDeleteTarget(part)}
                      />
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

      <PartDetailSheet
        partId={viewingPartId}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setViewingPartId(null);
        }}
        actionsBusy={actionsBusy}
        onEdit={(part) => {
          setDetailOpen(false);
          openEdit(part);
        }}
        onDelete={(part) => {
          setDetailOpen(false);
          setDeleteTarget(part);
        }}
        onActivate={(part) => activate.mutate(part.id)}
        onDeactivate={(part) => deactivate.mutate(part.id)}
      />

      <PartFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        part={editingPart}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete part?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed.`
            : ''
        }
        confirmLabel="Delete"
        variant="destructive"
        loading={deletePart.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deletePart.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
}
