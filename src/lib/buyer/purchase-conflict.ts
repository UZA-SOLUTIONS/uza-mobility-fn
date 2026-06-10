import type { BuyerInvoice } from '@/types/buyer/commerce';
import type { VehicleBooking } from '@/types/buyer/bookings';

export const SUPERSEDED_BY_OTHER_BUYER_MESSAGE =
  'Another buyer completed payment first. This vehicle is no longer available through this request.';

export function wasSupersededByOtherBuyerText(
  text: string | null | undefined,
): boolean {
  if (!text) return false;
  return text.includes(SUPERSEDED_BY_OTHER_BUYER_MESSAGE);
}

export function findSupersededBooking(
  bookings: VehicleBooking[] | undefined,
): VehicleBooking | null {
  return (
    bookings?.find(
      (row) =>
        row.status === 'CANCELLED' &&
        wasSupersededByOtherBuyerText(row.rejectionReason),
    ) ?? null
  );
}

export function findSupersededInvoice(
  invoices: BuyerInvoice[] | undefined,
): BuyerInvoice | null {
  return (
    invoices?.find(
      (row) =>
        row.status === 'CANCELLED' && wasSupersededByOtherBuyerText(row.notes),
    ) ?? null
  );
}
