'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PublishedListingPicker } from '@/components/buyer/published-listing-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatUsd } from '@/lib/admin/format';
import { useRequestInvoice } from '@/queries/buyer';
import {
  requestInvoiceSchema,
  type RequestInvoiceInput,
} from '@/schemas/buyer';
import type { PublicListingSummary } from '@/types/buyer/commerce';

type RequestInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RequestInvoiceDialog({
  open,
  onOpenChange,
}: RequestInvoiceDialogProps) {
  const request = useRequestInvoice();
  const [selectedListing, setSelectedListing] =
    useState<PublicListingSummary | null>(null);

  const form = useForm<RequestInvoiceInput>({
    resolver: zodResolver(requestInvoiceSchema),
    defaultValues: { listingId: '', notes: '', buyerAddress: '' },
  });

  const listingId = form.watch('listingId');

  useEffect(() => {
    if (!open) return;
    setSelectedListing(null);
    form.reset({ listingId: '', notes: '', buyerAddress: '' });
    // Only reset when the dialog opens — not when `form` identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = form.handleSubmit((values) => {
    request.mutate(values, {
      onSuccess: () => {
        form.reset();
        setSelectedListing(null);
        onOpenChange(false);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request proforma invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <PublishedListingPicker
            label="Vehicle listing"
            value={listingId ?? ''}
            enabled={open}
            selectedListing={selectedListing}
            onValueChange={(value, listing) => {
              form.setValue('listingId', value, { shouldValidate: true });
              setSelectedListing(listing);
            }}
            placeholder="Search and select a vehicle"
            helperText="Choose from published listings on the marketplace."
            error={form.formState.errors.listingId?.message}
          />

          {selectedListing ? (
            <div className="space-y-1 rounded-md border bg-muted/30 p-3 text-sm">
              <p className="font-medium">Selected vehicle</p>
              <p>
                {selectedListing.brand} {selectedListing.model} ·{' '}
                {selectedListing.manufacturingYear}
              </p>
              {selectedListing.listingPricing?.finalPriceUsd != null ? (
                <p className="text-muted-foreground">
                  From {formatUsd(selectedListing.listingPricing.finalPriceUsd)}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="buyer-address">Delivery / billing address</Label>
            <Input id="buyer-address" {...form.register('buyerAddress')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="invoice-notes">Notes</Label>
            <Textarea id="invoice-notes" rows={2} {...form.register('notes')} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={request.isPending}>
              {request.isPending ? 'Submitting…' : 'Request invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
