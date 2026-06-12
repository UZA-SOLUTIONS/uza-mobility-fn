'use client';

import Link from 'next/link';
import { Car, CreditCard, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { workspaceRoutes } from '@/config/routes';
import { isPayableInvoiceStatus } from '@/lib/buyer/invoice-flow';
import { useMyInvoices } from '@/queries/buyer';
import { useMyBookings } from '@/queries/bookings';

export function BuyerNextSteps() {
  const { data: payableInvoices } = useMyInvoices({
    payableOnly: true,
    limit: 5,
  });
  const { data: pendingInvoices } = useMyInvoices({
    pendingPurchase: true,
    limit: 5,
  });
  const { data: awaitingPayment } = useMyBookings({
    status: 'AWAITING_PAYMENT',
    limit: 5,
    activeOnly: true,
  });
  const { data: underReviewBookings } = useMyBookings({
    status: 'UNDER_VERIFICATION',
    limit: 5,
    activeOnly: true,
  });

  const invoicePayable =
    payableInvoices?.items.filter((invoice) =>
      isPayableInvoiceStatus(invoice.status),
    ) ?? [];
  const invoicesUnderReview =
    pendingInvoices?.items.filter(
      (invoice) =>
        invoice.status === 'PAYMENT_SUBMITTED' ||
        invoice.status === 'UNDER_VERIFICATION',
    ) ?? [];

  const firstPayableInvoice = invoicePayable[0];
  const firstPayableBooking = awaitingPayment?.items[0];
  const hasBookingReview = (underReviewBookings?.items.length ?? 0) > 0;
  const hasInvoiceReview = invoicesUnderReview.length > 0;

  if (
    invoicePayable.length === 0 &&
    !hasInvoiceReview &&
    (awaitingPayment?.meta.total ?? 0) === 0 &&
    !hasBookingReview
  ) {
    return null;
  }

  return (
    <div className="space-y-3">
      {invoicePayable.length > 0 && firstPayableInvoice ? (
        <Alert>
          <FileText className="size-4" />
          <AlertTitle>
            {invoicePayable.length === 1
              ? 'Invoice awaiting payment'
              : `${invoicePayable.length} invoices awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {firstPayableInvoice.invoiceNumber}
              {firstPayableInvoice.vehicleBrand
                ? ` · ${firstPayableInvoice.vehicleBrand} ${firstPayableInvoice.vehicleModel}`
                : ''}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountInvoices}?highlight=${firstPayableInvoice.id}&payment=${firstPayableInvoice.id}`}
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

      {hasInvoiceReview ? (
        <Alert>
          <CreditCard className="size-4" />
          <AlertTitle>Purchase payment under review</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              We are verifying your payment
              {invoicesUnderReview[0]
                ? ` for ${invoicesUnderReview[0].invoiceNumber}`
                : ''}
              . You will be notified when it is confirmed.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={workspaceRoutes.accountPayments}>View payments</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {(awaitingPayment?.meta.total ?? 0) > 0 && firstPayableBooking ? (
        <Alert>
          <Car className="size-4" />
          <AlertTitle>
            {awaitingPayment?.meta.total === 1
              ? 'Booking awaiting payment'
              : `${awaitingPayment?.meta.total} bookings awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {firstPayableBooking.bookingNumber}
              {firstPayableBooking.listing?.listingTitle
                ? ` · ${firstPayableBooking.listing.listingTitle}`
                : ''}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountBookings}?bookingId=${firstPayableBooking.id}`}
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

      {hasBookingReview ? (
        <Alert>
          <CreditCard className="size-4" />
          <AlertTitle>Booking payment under review</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              We are verifying your booking payment
              {underReviewBookings?.items[0]
                ? ` for ${underReviewBookings.items[0].bookingNumber}`
                : ''}
              .
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
