'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import { formatUsd } from '@/lib/admin/format';
import {
  findActiveBuyerBooking,
  isCancellableBuyerBooking,
} from '@/lib/buyer/booking-flow';
import { useAppRouter } from '@/lib/navigation/use-app-router';
import {
  useBookingFeeQuote,
  useCancelBooking,
  useMyBookings,
  useRequestVehicleBooking,
} from '@/queries/bookings';
import { useBuyerProfile, useMyInvoices } from '@/queries/buyer';
import { isMeUser } from '@/types/auth/me-user';
import type { PublicListing } from '@/types/marketplace/public-listing';
import type { VehicleBooking } from '@/types/buyer/bookings';

type VehicleDetailBookingActionProps = {
  listing: PublicListing;
};

export function VehicleDetailBookingAction({
  listing,
}: VehicleDetailBookingActionProps) {
  const router = useAppRouter();
  const { data: session, status } = useSession();
  const me = isMeUser(session?.user) ? session.user : null;
  const isChinaStock = listing.sellerType === 'UZA_CHINA_SOURCING';
  const isAuthenticatedBuyer =
    status === 'authenticated' && Boolean(me?.roles.includes('BUYER'));

  const { data: feeQuote } = useBookingFeeQuote(isChinaStock);
  const request = useRequestVehicleBooking();
  const cancelBooking = useCancelBooking();
  const [cancelTarget, setCancelTarget] = useState<VehicleBooking | null>(null);

  const bookingReturnHref = `/vehicles/${listing.slug}`;
  const loginHref = `${authRoutes.login}?callbackUrl=${encodeURIComponent(bookingReturnHref)}`;
  const profileHref = `${workspaceRoutes.accountProfile}?returnTo=${encodeURIComponent(bookingReturnHref)}`;

  const {
    data: myBookings,
    isLoading: bookingsLoading,
    isFetched: bookingsFetched,
  } = useMyBookings(
    { listingId: listing.id, limit: 5, activeOnly: true },
    isAuthenticatedBuyer && isChinaStock,
  );

  const {
    data: listingInvoices,
    isLoading: invoicesLoading,
    isFetched: invoicesFetched,
  } = useMyInvoices(
    { listingId: listing.id, pendingPurchase: true, limit: 5 },
    isAuthenticatedBuyer && isChinaStock,
  );

  const { data: buyerProfile, isLoading: profileLoading } =
    useBuyerProfile(isAuthenticatedBuyer);

  const buyerDataReady =
    !isAuthenticatedBuyer ||
    ((!bookingsLoading || bookingsFetched) &&
      (!invoicesLoading || invoicesFetched));

  const activeBooking = isAuthenticatedBuyer
    ? findActiveBuyerBooking(myBookings?.items)
    : null;

  const activeInvoice = isAuthenticatedBuyer
    ? (listingInvoices?.items[0] ?? null)
    : null;

  const confirmCancelBooking = () => {
    if (!cancelTarget) return;
    const bookingId = cancelTarget.id;
    setCancelTarget(null);
    cancelBooking.mutate(bookingId);
  };

  if (!isChinaStock) {
    return null;
  }

  if (status === 'loading' || (isAuthenticatedBuyer && !buyerDataReady)) {
    return (
      <div className="mt-6 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (!isAuthenticatedBuyer) {
    if (listing.isBooked) {
      return (
        <div className="mt-6 rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm text-[#356769]">
          This vehicle is currently booked. Contact UZA Mobility for next steps.
        </div>
      );
    }

    return (
      <div className="mt-6 space-y-2">
        <Link
          href={loginHref}
          className="flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: brand.tealCard }}
        >
          Book This Vehicle
        </Link>
        <p className="text-center text-xs text-[#356769]">
          Sign in to book this China-sourced vehicle (
          {feeQuote ? formatUsd(feeQuote.bookingFeeUsd) : 'USD fee applies'}).
        </p>
      </div>
    );
  }

  if (listing.isBooked && !activeBooking) {
    return (
      <div className="mt-6 rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm text-[#356769]">
        This vehicle is currently booked. Contact UZA Mobility for next steps.
      </div>
    );
  }

  if (activeInvoice) {
    return (
      <div className="mt-6 rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm text-[#356769]">
        You already have an active invoice for this vehicle. Complete that
        purchase flow before starting a booking.
      </div>
    );
  }

  if (activeBooking) {
    return (
      <>
        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm">
            <p className="font-medium text-[#151515]">
              Booking {activeBooking.bookingNumber}
            </p>
            <p className="mt-1 text-[#356769] capitalize">
              {activeBooking.status.replaceAll('_', ' ').toLowerCase()}
            </p>
            <p className="mt-2 text-[#356769]">
              Booking fee: {formatUsd(activeBooking.bookingFeeUsd)}
            </p>
          </div>
          {isCancellableBuyerBooking(activeBooking.status) ? (
            <>
              <Button
                asChild
                className="h-10 w-full rounded-full"
                style={{ backgroundColor: brand.forest }}
              >
                <Link
                  href={`${workspaceRoutes.accountBookings}?bookingId=${activeBooking.id}`}
                >
                  Submit booking payment
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-full text-destructive hover:text-destructive"
                disabled={cancelBooking.isPending}
                onClick={() => setCancelTarget(activeBooking)}
              >
                Cancel booking
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-full"
            >
              <Link href={workspaceRoutes.accountBookings}>
                View my bookings
              </Link>
            </Button>
          )}
        </div>

        <ConfirmDialog
          open={Boolean(cancelTarget)}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null);
          }}
          title="Cancel booking?"
          description={
            cancelTarget
              ? `Booking ${cancelTarget.bookingNumber} will be cancelled. You can book another vehicle when ready.`
              : ''
          }
          confirmLabel="Cancel booking"
          variant="destructive"
          loading={cancelBooking.isPending}
          onConfirm={confirmCancelBooking}
        />
      </>
    );
  }

  if (listing.isBooked) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="mt-6 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  const hasBuyerProfile = Boolean(me?.buyerProfile ?? buyerProfile);

  if (!hasBuyerProfile) {
    return (
      <div className="mt-6 space-y-2">
        <Button
          asChild
          className="h-10 w-full rounded-full"
          style={{ backgroundColor: brand.tealCard }}
        >
          <Link href={profileHref}>Complete buyer profile to book</Link>
        </Button>
      </div>
    );
  }

  const handleBook = () => {
    request.mutate(
      { listingId: listing.id },
      {
        onSuccess: (booking) => {
          toast.success('Booking created — submit your payment next');
          router.push(
            `${workspaceRoutes.accountBookings}?highlight=${booking.id}`,
          );
        },
      },
    );
  };

  return (
    <div className="mt-6 space-y-2">
      <Button
        type="button"
        disabled={request.isPending}
        onClick={handleBook}
        className="h-10 w-full rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: brand.tealCard }}
      >
        {request.isPending ? 'Creating booking…' : 'Book This Vehicle'}
      </Button>
      <p className="text-center text-xs text-[#356769]">
        Secure this import with a{' '}
        {feeQuote ? formatUsd(feeQuote.bookingFeeUsd) : 'small USD'} booking
        fee. Payment is verified by our finance team.
      </p>
    </div>
  );
}
