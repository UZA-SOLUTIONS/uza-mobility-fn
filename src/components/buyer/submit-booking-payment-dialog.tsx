'use client';

import { useEffect, useState } from 'react';
import { PaymentProofFileInput } from '@/components/buyer/payment-proof-file-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatUsd } from '@/lib/admin/format';
import { useSubmitBookingPayment } from '@/queries/bookings';
import type { VehicleBooking } from '@/types/buyer/bookings';

type SubmitBookingPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: VehicleBooking | null;
};

export function SubmitBookingPaymentDialog({
  open,
  onOpenChange,
  booking,
}: SubmitBookingPaymentDialogProps) {
  const submit = useSubmitBookingPayment();
  const [proofs, setProofs] = useState<File[]>([]);

  useEffect(() => {
    if (!open) {
      setProofs([]);
    }
  }, [open, booking?.id]);

  const onSubmit = () => {
    if (!booking || proofs.length === 0) return;

    submit.mutate(
      {
        bookingId: booking.id,
        payload: {
          amountPaid: booking.bookingFeeUsd,
          transferReference: booking.paymentReference,
        },
        proofs,
      },
      {
        onSuccess: () => {
          setProofs([]);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        onInteractOutside={(event) => {
          if (proofs.length > 0) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Submit booking payment</DialogTitle>
        </DialogHeader>

        {booking ? (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <p className="font-medium">
                {booking.listing?.listingTitle ?? booking.bookingNumber}
              </p>
              <p className="mt-1 text-muted-foreground">
                Booking fee: {formatUsd(booking.bookingFeeUsd)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Use payment reference{' '}
                <span className="font-mono">{booking.paymentReference}</span>{' '}
                when transferring funds.
              </p>
            </div>

            <PaymentProofFileInput
              files={proofs}
              onFilesChange={setProofs}
              disabled={submit.isPending}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No payable booking selected.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submit.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submit.isPending || !booking || proofs.length === 0}
            onClick={onSubmit}
          >
            {submit.isPending ? 'Submitting…' : 'Submit payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
