'use client';

import Link from 'next/link';
import { Car, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { workspaceRoutes } from '@/config/routes';
import { useMyBookings } from '@/queries/bookings';

export function BuyerNextSteps() {
  const { data: awaitingPayment } = useMyBookings({
    status: 'AWAITING_PAYMENT',
    limit: 5,
    activeOnly: true,
  });
  const { data: underReview } = useMyBookings({
    status: 'UNDER_VERIFICATION',
    limit: 5,
    activeOnly: true,
  });

  const payableCount = awaitingPayment?.meta.total ?? 0;
  const firstPayable = awaitingPayment?.items[0];
  const underReviewBookings = underReview?.items ?? [];
  const hasReviewState = underReviewBookings.length > 0;

  if (payableCount === 0 && !hasReviewState) {
    return null;
  }

  return (
    <div className="space-y-3">
      {payableCount > 0 && firstPayable ? (
        <Alert>
          <Car className="size-4" />
          <AlertTitle>
            {payableCount === 1
              ? 'Booking awaiting payment'
              : `${payableCount} bookings awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {firstPayable.bookingNumber}
              {firstPayable.listing?.listingTitle
                ? ` · ${firstPayable.listing.listingTitle}`
                : ''}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountBookings}?bookingId=${firstPayable.id}`}
              >
                Submit booking payment
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={workspaceRoutes.accountBookings}>View bookings</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {hasReviewState ? (
        <Alert>
          <CreditCard className="size-4" />
          <AlertTitle>Booking payment under review</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              We are verifying your booking payment
              {underReviewBookings[0]
                ? ` for ${underReviewBookings[0].bookingNumber}`
                : ''}
              . You will be notified when it is confirmed.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={workspaceRoutes.accountBookings}>View bookings</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
