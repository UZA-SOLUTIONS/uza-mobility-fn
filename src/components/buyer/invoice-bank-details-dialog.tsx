'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { formatDate, formatUsd } from '@/lib/format';
import { downloadInvoiceDocument } from '@/lib/api/buyer';
import { invoiceStatusHint } from '@/lib/buyer/invoice-flow';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { BuyerInvoice } from '@/types/buyer/commerce';

type InvoiceBankDetailsDialogProps = {
  invoice: BuyerInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitPayment?: (invoiceId: string) => void;
};

export function InvoiceBankDetailsDialog({
  invoice,
  open,
  onOpenChange,
  onSubmitPayment,
}: InvoiceBankDetailsDialogProps) {
  const [downloading, setDownloading] = useState(false);

  if (!invoice) return null;

  const hint = invoiceStatusHint(invoice.status, invoice.notes);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment instructions</DialogTitle>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Invoice</dt>
            <dd className="font-medium">{invoice.invoiceNumber}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Amount due</dt>
            <dd className="font-medium">
              {formatUsd(invoice.totalAmountUsd)} {invoice.currency}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Payment reference</dt>
            <dd className="font-mono text-xs">{invoice.paymentReference}</dd>
          </div>
          {invoice.beneficiaryName ? (
            <div>
              <dt className="text-muted-foreground">Beneficiary</dt>
              <dd>{invoice.beneficiaryName}</dd>
            </div>
          ) : null}
          {invoice.bankName ? (
            <div>
              <dt className="text-muted-foreground">Bank</dt>
              <dd>{invoice.bankName}</dd>
            </div>
          ) : null}
          {invoice.accountNumber ? (
            <div>
              <dt className="text-muted-foreground">Account number</dt>
              <dd className="font-mono text-xs">{invoice.accountNumber}</dd>
            </div>
          ) : null}
          {invoice.paymentDeadline ? (
            <div>
              <dt className="text-muted-foreground">Pay before</dt>
              <dd>{formatDate(invoice.paymentDeadline)}</dd>
            </div>
          ) : null}
        </dl>
        {hint ? (
          <p className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            {hint}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={downloading}
            onClick={async () => {
              setDownloading(true);
              try {
                await downloadInvoiceDocument(
                  invoice.id,
                  invoice.invoiceNumber,
                );
                toast.success('Invoice downloaded');
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Could not download invoice',
                );
              } finally {
                setDownloading(false);
              }
            }}
          >
            {downloading ? 'Downloading…' : 'Download invoice'}
          </Button>
          {onSubmitPayment ? (
            <Button
              type="button"
              onClick={() => {
                onSubmitPayment(invoice.id);
                onOpenChange(false);
              }}
            >
              Submit payment
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
