'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  NumberInput,
  numberRegisterOptions,
} from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyInvoices, useSubmitPayment } from '@/queries/buyer';
import { submitPaymentSchema, type SubmitPaymentInput } from '@/schemas/buyer';

type SubmitPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultInvoiceId?: string;
};

export function SubmitPaymentDialog({
  open,
  onOpenChange,
  defaultInvoiceId,
}: SubmitPaymentDialogProps) {
  const submit = useSubmitPayment();
  const { data: invoices } = useMyInvoices({ limit: 50 });
  const [proofs, setProofs] = useState<File[]>([]);

  const form = useForm<SubmitPaymentInput>({
    resolver: zodResolver(submitPaymentSchema),
    defaultValues: {
      invoiceId: defaultInvoiceId ?? '',
      amountPaid: 0,
      currency: 'USD',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    submit.mutate(
      { body: values, proofs },
      {
        onSuccess: () => {
          form.reset({ invoiceId: '', amountPaid: 0, currency: 'USD' });
          setProofs([]);
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit payment proof</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Invoice</Label>
            <Select
              value={form.watch('invoiceId') || undefined}
              onValueChange={(v) => form.setValue('invoiceId', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select invoice" />
              </SelectTrigger>
              <SelectContent>
                {invoices?.items.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} · {inv.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount paid (USD)</Label>
              <NumberInput
                id="amount"
                min={0}
                step="0.01"
                {...form.register('amountPaid', numberRegisterOptions())}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ref">Transfer reference</Label>
              <Input id="ref" {...form.register('transferReference')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bank">Bank name</Label>
            <Input id="bank" {...form.register('bankName')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sender">Sender name</Label>
            <Input id="sender" {...form.register('senderName')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pay-notes">Notes</Label>
            <Textarea id="pay-notes" rows={2} {...form.register('notes')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proofs">Proof files (images or PDF)</Label>
            <Input
              id="proofs"
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={(e) => setProofs(Array.from(e.target.files ?? []))}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submit.isPending}>
              {submit.isPending ? 'Submitting…' : 'Submit payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
