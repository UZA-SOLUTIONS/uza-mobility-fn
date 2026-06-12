'use client';

import Link from 'next/link';
import { Car, CreditCard, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { workspaceRoutes } from '@/config/routes';
import { bookingPaymentWasRejected } from '@/lib/buyer/booking-flow';
import {
  invoiceLastRejectionReason,
  invoicePaymentWasRejected,
  isPayableInvoiceStatus,
} from '@/lib/buyer/invoice-flow';
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

  const rejectedInvoices = invoicePayable.filter((invoice) =>
    invoicePaymentWasRejected(invoice),
  );
  const firstRejectedInvoice = rejectedInvoices[0];
  const firstPayableInvoice = invoicePayable[0];
  const featuredInvoice = firstRejectedInvoice ?? firstPayableInvoice;
  const featuredRejectionReason = featuredInvoice
    ? invoiceLastRejectionReason(featuredInvoice)
    : null;
  const firstPayableBooking = awaitingPayment?.items[0];
  const rejectedBookings =
    awaitingPayment?.items.filter((booking) =>
      bookingPaymentWasRejected(booking),
    ) ?? [];
  const firstRejectedBooking = rejectedBookings[0];
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
      {invoicePayable.length > 0 && featuredInvoice ? (
        <Alert variant={firstRejectedInvoice ? 'destructive' : 'default'}>
          <FileText className="size-4" />
          <AlertTitle>
            {firstRejectedInvoice
              ? rejectedInvoices.length === 1
                ? 'Invoice payment needs resubmission'
                : `${rejectedInvoices.length} invoices need payment resubmission`
              : invoicePayable.length === 1
                ? 'Invoice awaiting payment'
                : `${invoicePayable.length} invoices awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {featuredInvoice.invoiceNumber}
              {featuredInvoice.vehicleBrand
                ? ` · ${featuredInvoice.vehicleBrand} ${featuredInvoice.vehicleModel}`
                : ''}
              {featuredRejectionReason ? ` — ${featuredRejectionReason}` : ''}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountInvoices}?highlight=${featuredInvoice.id}&payment=${featuredInvoice.id}`}
              >
                {firstRejectedInvoice ? 'Resubmit payment' : 'Submit payment'}
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
        <Alert variant={firstRejectedBooking ? 'destructive' : 'default'}>
          <Car className="size-4" />
          <AlertTitle>
            {firstRejectedBooking
              ? rejectedBookings.length === 1
                ? 'Booking payment needs resubmission'
                : `${rejectedBookings.length} bookings need payment resubmission`
              : awaitingPayment?.meta.total === 1
                ? 'Booking awaiting payment'
                : `${awaitingPayment?.meta.total} bookings awaiting payment`}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-3">
            <span>
              {(firstRejectedBooking ?? firstPayableBooking).bookingNumber}
              {(firstRejectedBooking ?? firstPayableBooking).listing
                ?.listingTitle
                ? ` · ${(firstRejectedBooking ?? firstPayableBooking).listing?.listingTitle}`
                : ''}
              {firstRejectedBooking?.rejectionReason
                ? ` — ${firstRejectedBooking.rejectionReason}`
                : ''}
            </span>
            <Button size="sm" asChild>
              <Link
                href={`${workspaceRoutes.accountBookings}?bookingId=${(firstRejectedBooking ?? firstPayableBooking).id}`}
              >
                {firstRejectedBooking
                  ? 'Resubmit booking payment'
                  : 'Submit booking payment'}
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
