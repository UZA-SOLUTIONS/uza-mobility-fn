import type { VehicleBooking } from '@/types/buyer/bookings';

export const ACTIVE_BUYER_BOOKING_STATUSES = [
  'AWAITING_PAYMENT',
  'PAYMENT_SUBMITTED',
  'UNDER_VERIFICATION',
  'CONFIRMED',
] as const;

export const INACTIVE_BUYER_BOOKING_STATUSES = [
  'CANCELLED',
  'REJECTED',
  'EXPIRED',
] as const;

export type ActiveBuyerBookingStatus =
  (typeof ACTIVE_BUYER_BOOKING_STATUSES)[number];

export function isActiveBuyerBookingStatus(
  status: VehicleBooking['status'],
): status is ActiveBuyerBookingStatus {
  return (ACTIVE_BUYER_BOOKING_STATUSES as readonly string[]).includes(status);
}

export function isCancellableBuyerBooking(
  status: VehicleBooking['status'],
): boolean {
  return status === 'AWAITING_PAYMENT';
}

export function filterActiveBuyerBookings(
  bookings: VehicleBooking[] | undefined,
): VehicleBooking[] {
  return (
    bookings?.filter(
      (row) =>
        isActiveBuyerBookingStatus(row.status) &&
        !(INACTIVE_BUYER_BOOKING_STATUSES as readonly string[]).includes(
          row.status,
        ),
    ) ?? []
  );
}

export function findActiveBuyerBooking(
  bookings: VehicleBooking[] | undefined,
): VehicleBooking | null {
  const active = filterActiveBuyerBookings(bookings)[0];
  if (active) return active;
  return bookings?.find((row) => bookingPaymentWasRejected(row)) ?? null;
}

export function bookingPaymentWasRejected(
  booking: Pick<VehicleBooking, 'status' | 'rejectionReason'>,
): boolean {
  if (!booking.rejectionReason) return false;
  return booking.status === 'AWAITING_PAYMENT' || booking.status === 'REJECTED';
}

export function isBookingPaymentSubmittable(
  booking: Pick<VehicleBooking, 'status' | 'rejectionReason'>,
): boolean {
  return (
    booking.status === 'AWAITING_PAYMENT' || bookingPaymentWasRejected(booking)
  );
}

export function bookingStatusHint(
  booking: Pick<VehicleBooking, 'status' | 'rejectionReason'>,
): string | null {
  if (bookingPaymentWasRejected(booking)) {
    return 'Payment rejected — review the reason and submit again.';
  }
  switch (booking.status) {
    case 'AWAITING_PAYMENT':
      return 'Submit your booking fee payment proof to continue.';
    case 'PAYMENT_SUBMITTED':
    case 'UNDER_VERIFICATION':
      return 'Payment under review — we will notify you when confirmed.';
    case 'CONFIRMED':
      return 'Booking confirmed — we will follow up on your import.';
    case 'REJECTED':
      return 'This booking is no longer active.';
    case 'CANCELLED':
    case 'EXPIRED':
      return 'This booking is no longer active.';
    default:
      return null;
  }
}
