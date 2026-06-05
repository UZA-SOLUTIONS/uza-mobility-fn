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
  return filterActiveBuyerBookings(bookings)[0] ?? null;
}
