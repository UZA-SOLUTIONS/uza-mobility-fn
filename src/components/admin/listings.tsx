'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { usePermissions } from '@/hooks/permissions';
import { PageHeader } from '@/components/shared/page-header';
import { PaginationBar } from '@/components/admin/shared/pagination-bar';
import { StatusBadge } from '@/components/admin/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  useAdminListings,
  useApproveListing,
  useDeleteListing,
  useFeatureListing,
  useHotDealListing,
  usePublishListing,
  useRejectListing,
} from '@/queries/admin';
import {
  listingStatuses,
  type AdminListing,
  type AdminListingsFilters,
  type ListingStatus,
} from '@/types/admin/marketplace';
import { rejectListingSchema } from '@/schemas/admin';

function formatUsd(value: number | null | undefined) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ListingActions({ listing }: { listing: AdminListing }) {
  const { can } = usePermissions();
  const approve = useApproveListing();
  const publish = usePublishListing();
  const reject = useRejectListing();
  const feature = useFeatureListing();
  const hotDeal = useHotDealListing();
  const remove = useDeleteListing();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  const busy =
    approve.isPending ||
    publish.isPending ||
    reject.isPending ||
    feature.isPending ||
    hotDeal.isPending ||
    remove.isPending;

  const handleReject = () => {
    const parsed = rejectListingSchema.safeParse({ reason });
    if (!parsed.success) {
      setReasonError(parsed.error.issues[0]?.message ?? 'Invalid reason');
      return;
    }
    setReasonError(null);
    reject.mutate(
      { id: listing.id, body: parsed.data },
      { onSuccess: () => setRejectOpen(false) },
    );
  };

  return (
    <>
      <div className="flex flex-wrap justify-end gap-1">
        {listing.status === 'PENDING_REVIEW' && can('listings:approve') ? (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => approve.mutate(listing.id)}
          >
            Approve
          </Button>
        ) : null}
        {listing.status === 'APPROVED' && can('listings:approve') ? (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => publish.mutate(listing.id)}
          >
            Publish
          </Button>
        ) : null}
        {(listing.status === 'PENDING_REVIEW' ||
          listing.status === 'APPROVED') &&
        can('listings:reject') ? (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => setRejectOpen(true)}
          >
            Reject
          </Button>
        ) : null}
        {can('listings:feature') ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => feature.mutate(listing.id)}
            >
              {listing.isFeatured ? 'Unfeature' : 'Feature'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => hotDeal.mutate(listing.id)}
            >
              {listing.isHotDeal ? 'Unhot' : 'Hot deal'}
            </Button>
          </>
        ) : null}
        {can('listings:delete') ? (
          <Button
            size="sm"
            variant="destructive"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  `Permanently delete "${listing.listingTitle}"? This cannot be undone.`,
                )
              ) {
                remove.mutate(listing.id);
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason for seller</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain what needs to change…"
              rows={4}
            />
            {reasonError ? (
              <p className="text-sm text-destructive">{reasonError}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={handleReject}
            >
              Reject listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminListingsPanel() {
  const [filters, setFilters] = useState<AdminListingsFilters>({
    page: 1,
    limit: 25,
    status: 'PENDING_REVIEW',
  });
  const [sellerIdInput, setSellerIdInput] = useState('');
  const debouncedSellerId = useDebounce(sellerIdInput, 400);

  const queryFilters: AdminListingsFilters = {
    ...filters,
    sellerId: debouncedSellerId || undefined,
  };

  const { data, isLoading, isError, error } = useAdminListings(queryFilters);

  const setStatus = (status: string) => {
    setFilters((current) => ({
      ...current,
      status: status === 'ALL' ? undefined : (status as ListingStatus),
      page: 1,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listings"
        description="Review pending listings, approve, publish, feature, or reject."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={filters.status ?? 'ALL'} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {listingStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:min-w-[240px]">
          <Label htmlFor="seller-id">Seller ID</Label>
          <Input
            id="seller-id"
            placeholder="Filter by seller…"
            value={sellerIdInput}
            onChange={(event) => {
              setSellerIdInput(event.target.value);
              setFilters((current) => ({ ...current, page: 1 }));
            }}
          />
        </div>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : 'Failed to load listings.'}
        </p>
      ) : null}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((__, cell) => (
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
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No listings match these filters.
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading
              ? data?.items.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div className="font-medium">{listing.listingTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {listing.brand} {listing.model} ·{' '}
                        {listing.category.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{listing.seller.businessName}</div>
                      <div className="text-xs text-muted-foreground">
                        {listing.seller.city ?? listing.seller.country}
                        {listing.seller.isVerified ? ' · Verified' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={listing.status} />
                      {listing.isFeatured ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          Featured
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {formatUsd(listing.listingPricing?.finalPriceUsd)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(listing.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <ListingActions listing={listing} />
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
