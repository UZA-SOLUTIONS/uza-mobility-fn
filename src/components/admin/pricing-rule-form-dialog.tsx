'use client';

import { useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreatePricingRule, useUpdatePricingRule } from '@/queries/platform';
import {
  createPricingRuleSchema,
  type CreatePricingRuleInput,
} from '@/schemas/platform';
import { pricingSellerTypes, type PricingRule } from '@/types/admin/platform';

type PricingRuleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: PricingRule | null;
};

export function PricingRuleFormDialog({
  open,
  onOpenChange,
  rule,
}: PricingRuleFormDialogProps) {
  const isEdit = Boolean(rule);
  const create = useCreatePricingRule();
  const update = useUpdatePricingRule();

  const form = useForm<CreatePricingRuleInput>({
    resolver: zodResolver(createPricingRuleSchema),
    defaultValues: {
      sellerType: 'UZA_RWANDA_STOCK',
      isActive: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (rule) {
      form.reset({
        sellerType: rule.sellerType,
        originCountry: rule.originCountry ?? '',
        destinationCountry: rule.destinationCountry ?? '',
        shippingCostUsd: rule.shippingCostUsd ?? undefined,
        localChargesUsd: rule.localChargesUsd ?? undefined,
        taxRatePercent: rule.taxRatePercent ?? undefined,
        insuranceRatePercent: rule.insuranceRatePercent ?? undefined,
        storagePerDayUsd: rule.storagePerDayUsd ?? undefined,
        clearingFeeUsd: rule.clearingFeeUsd ?? undefined,
        platformMarginPercent: rule.platformMarginPercent ?? undefined,
        commissionRate: rule.commissionRate ?? undefined,
        exchangeRateRwf: rule.exchangeRateRwf ?? undefined,
        deliveryDaysMin: rule.deliveryDaysMin ?? undefined,
        deliveryDaysMax: rule.deliveryDaysMax ?? undefined,
        isActive: rule.isActive,
      });
    } else {
      form.reset({
        sellerType: 'UZA_RWANDA_STOCK',
        isActive: true,
      });
    }
  }, [open, rule, form]);

  const busy = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const body = {
      ...values,
      originCountry: values.originCountry?.trim() || undefined,
      destinationCountry: values.destinationCountry?.trim() || undefined,
    };

    if (isEdit && rule) {
      update.mutate(
        { id: rule.id, body },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      create.mutate(body, { onSuccess: () => onOpenChange(false) });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit pricing rule' : 'Add pricing rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Seller type</Label>
            <Select
              value={form.watch('sellerType')}
              onValueChange={(v) =>
                form.setValue(
                  'sellerType',
                  v as CreatePricingRuleInput['sellerType'],
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pricingSellerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pr-origin">Origin country</Label>
              <Input
                id="pr-origin"
                placeholder="CN (optional)"
                {...form.register('originCountry')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-dest">Destination country</Label>
              <Input
                id="pr-dest"
                placeholder="RW (optional)"
                {...form.register('destinationCountry')}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pr-ship">Shipping (USD)</Label>
              <Input
                id="pr-ship"
                type="number"
                step="0.01"
                {...form.register('shippingCostUsd', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-local">Local charges (USD)</Label>
              <Input
                id="pr-local"
                type="number"
                step="0.01"
                {...form.register('localChargesUsd', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-tax">Tax %</Label>
              <Input
                id="pr-tax"
                type="number"
                step="0.01"
                {...form.register('taxRatePercent', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-ins">Insurance %</Label>
              <Input
                id="pr-ins"
                type="number"
                step="0.01"
                {...form.register('insuranceRatePercent', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-margin">Platform margin %</Label>
              <Input
                id="pr-margin"
                type="number"
                step="0.01"
                {...form.register('platformMarginPercent', {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-commission">Commission rate</Label>
              <Input
                id="pr-commission"
                type="number"
                step="0.01"
                {...form.register('commissionRate', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-rwf">USD → RWF rate</Label>
              <Input
                id="pr-rwf"
                type="number"
                {...form.register('exchangeRateRwf', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-clear">Clearing fee (USD)</Label>
              <Input
                id="pr-clear"
                type="number"
                step="0.01"
                {...form.register('clearingFeeUsd', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-storage">Storage / day (USD)</Label>
              <Input
                id="pr-storage"
                type="number"
                step="0.01"
                {...form.register('storagePerDayUsd', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-dmin">Delivery days min</Label>
              <Input
                id="pr-dmin"
                type="number"
                {...form.register('deliveryDaysMin', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-dmax">Delivery days max</Label>
              <Input
                id="pr-dmax"
                type="number"
                {...form.register('deliveryDaysMax', { valueAsNumber: true })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
