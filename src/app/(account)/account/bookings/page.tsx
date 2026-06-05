import { Suspense } from 'react';
import { BuyerBookingsPanel } from '@/components/buyer/bookings-panel';
import { Spinner } from '@/components/ui/spinner';

function BookingsFallback() {
  return (
    <div className="flex justify-center py-12">
      <Spinner className="size-6" />
    </div>
  );
}

export default function AccountBookingsPage() {
  return (
    <Suspense fallback={<BookingsFallback />}>
      <BuyerBookingsPanel />
    </Suspense>
  );
}
