'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { VehicleInquiryDialog } from '@/components/marketing/vehicle-inquiry-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import { formatUsd } from '@/lib/format';
import {
  findActiveBuyerBooking,
  isCancellableBuyerBooking,
} from '@/lib/buyer/booking-flow';
import { findSupersededBooking } from '@/lib/buyer/purchase-conflict';
import { VehiclePurchaseUnavailable } from '@/components/marketing/vehicle-purchase-unavailable';
import { useAppRouter } from '@/lib/navigation/use-app-router';
import {
  useBookingFeeQuote,
  useCancelBooking,
  useMyBookings,
  useRequestVehicleBooking,
} from '@/queries/bookings';
import { useBuyerProfile } from '@/queries/buyer';
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
  const isAuthenticatedBuyer =
    status === 'authenticated' && Boolean(me?.roles.includes('BUYER'));

  const { data: feeQuote } = useBookingFeeQuote();
  const request = useRequestVehicleBooking();
  const cancelBooking = useCancelBooking();
  const [cancelTarget, setCancelTarget] = useState<VehicleBooking | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const bookingReturnHref = `/vehicles/${listing.slug}`;
  const profileHref = `${workspaceRoutes.accountProfile}?returnTo=${encodeURIComponent(bookingReturnHref)}`;

  const {
    data: myBookings,
    isLoading: bookingsLoading,
    isFetched: bookingsFetched,
  } = useMyBookings(
    { listingId: listing.id, limit: 5, activeOnly: true },
    isAuthenticatedBuyer,
  );

  const { data: bookingHistory } = useMyBookings(
    { listingId: listing.id, limit: 10, activeOnly: false },
    isAuthenticatedBuyer,
  );

  const { data: buyerProfile, isLoading: profileLoading } =
    useBuyerProfile(isAuthenticatedBuyer);

  const buyerDataReady =
    !isAuthenticatedBuyer || !bookingsLoading || bookingsFetched;

  const activeBooking = isAuthenticatedBuyer
    ? findActiveBuyerBooking(myBookings?.items)
    : null;

  const supersededBooking = isAuthenticatedBuyer
    ? findSupersededBooking(bookingHistory?.items)
    : null;

  const confirmCancelBooking = () => {
    if (!cancelTarget) return;
    const bookingId = cancelTarget.id;
    setCancelTarget(null);
    cancelBooking.mutate(bookingId);
  };

  if (status === 'loading' || (isAuthenticatedBuyer && !buyerDataReady)) {
    return (
      <div className="mt-8 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (!isAuthenticatedBuyer) {
    if (listing.isBooked || listing.status === 'SOLD') {
      return (
        <div className="mt-8">
          <VehiclePurchaseUnavailable
            variant={listing.status === 'SOLD' ? 'sold' : 'booked'}
          />
        </div>
      );
    }

    return (
      <>
        <div className="mt-8 space-y-2">
          <Button
            type="button"
            onClick={() => setInquiryOpen(true)}
            className="h-10 w-full rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: brand.forest }}
          >
            Book This Vehicle
          </Button>
          <p className="text-center text-xs text-[#356769]">
            Share your details to receive a quote and next steps for this
            vehicle.
          </p>
        </div>
        <VehicleInquiryDialog
          listing={listing}
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          variant="book"
        />
      </>
    );
  }

  if (supersededBooking) {
    return (
      <div className="mt-8">
        <VehiclePurchaseUnavailable variant="superseded" />
      </div>
    );
  }

  if (listing.isBooked && !activeBooking) {
    return (
      <div className="mt-8">
        <VehiclePurchaseUnavailable variant="booked" />
      </div>
    );
  }

  if (listing.status === 'SOLD' && !activeBooking) {
    return (
      <div className="mt-8">
        <VehiclePurchaseUnavailable variant="sold" />
      </div>
    );
  }

  if (activeBooking) {
    return (
      <>
        <div className="mt-8 space-y-3">
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

  if (profileLoading) {
    return (
      <div className="mt-8 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  const hasBuyerProfile = Boolean(me?.buyerProfile ?? buyerProfile);

  if (!hasBuyerProfile) {
    return (
      <div className="mt-8 space-y-2">
        <Button
          asChild
          className="h-10 w-full rounded-full"
          style={{ backgroundColor: brand.forest }}
        >
          <Link href={profileHref}>Complete buyer profile to book</Link>
        </Button>
        <p className="text-center text-xs text-[#356769]">
          Complete your buyer profile before booking this vehicle.
        </p>
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
    <div className="mt-8 space-y-2">
      <Button
        type="button"
        disabled={request.isPending}
        onClick={handleBook}
        className="h-10 w-full rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: brand.forest }}
      >
        {request.isPending ? 'Creating booking…' : 'Book This Vehicle'}
      </Button>
      <p className="text-center text-xs text-[#356769]">
        Secure this vehicle with a{' '}
        {feeQuote ? formatUsd(feeQuote.bookingFeeUsd) : 'small USD'} booking
        fee. Payment is verified by our finance team.
      </p>
    </div>
  );
}
