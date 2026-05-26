'use client';

import { StatusBadge } from '@/components/admin/shared/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatDateTime, formatUsd } from '@/lib/admin/format';
import { formatSellerChannel } from '@/lib/auth/seller-profiles';
import { useOrderTracking } from '@/queries/buyer';
import type { BuyerOrder } from '@/types/buyer/commerce';

type OrderDetailSheetProps = {
  order: BuyerOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BuyerOrderDetailSheet({
  order,
  open,
  onOpenChange,
}: OrderDetailSheetProps) {
  const { data: tracking, isLoading } = useOrderTracking(
    open && order ? order.id : null,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        {!order ? null : (
          <>
            <SheetHeader>
              <SheetTitle>{order.orderNumber}</SheetTitle>
              <SheetDescription>
                {order.listing.listingTitle} ·{' '}
                {formatSellerChannel(order.sellerType)}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <StatusBadge status={order.status} />
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Vehicle</dt>
                  <dd>
                    {order.listing.brand} {order.listing.model}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Invoice</dt>
                  <dd>{order.invoice.invoiceNumber}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-medium">
                    {formatUsd(order.invoice.totalAmountUsd)}
                  </dd>
                </div>
              </dl>
              <div>
                <h3 className="mb-3 text-sm font-medium">Tracking</h3>
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <ol className="space-y-3 border-l pl-4">
                    {tracking?.events.map((event) => (
                      <li key={event.id} className="relative text-sm">
                        <span className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-primary" />
                        <p className="font-medium">{event.title}</p>
                        {event.description ? (
                          <p className="text-muted-foreground">
                            {event.description}
                          </p>
                        ) : null}
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(event.occurredAt)}
                        </p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
