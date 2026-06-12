'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { brand } from '@/lib/marketing/colors';
import { useSubmitInquiry } from '@/queries/inquiries';
import { inquirySchema, type InquiryInput } from '@/schemas/inquiry';
import type { PublicListing } from '@/types/marketplace/public-listing';

const COUNTRY_OPTIONS = [
  { value: 'RW', label: 'Rwanda' },
  { value: 'KE', label: 'Kenya' },
  { value: 'UG', label: 'Uganda' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'BI', label: 'Burundi' },
  { value: 'CD', label: 'DR Congo' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
];

type VehicleInquiryDialogProps = {
  listing: PublicListing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: InquiryInput['intent'];
};

export function VehicleInquiryDialog({
  listing,
  open,
  onOpenChange,
  variant,
}: VehicleInquiryDialogProps) {
  const isBuy = variant === 'BUY';
  const router = useRouter();
  const submit = useSubmitInquiry();

  const form = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      listingId: listing.id,
      intent: variant,
      name: '',
      phone: '',
      email: '',
      country: 'RW',
      buyerType: 'INDIVIDUAL',
      message: '',
    },
  });

  useEffect(() => {
    const message = `${isBuy ? 'Purchase' : 'Booking'} inquiry for ${listing.listingTitle} (ref ${listing.id.slice(-8).toUpperCase()})`;
    form.reset({
      listingId: listing.id,
      intent: variant,
      name: '',
      phone: '',
      email: '',
      country: 'RW',
      buyerType: 'INDIVIDUAL',
      message,
    });
  }, [listing.id, listing.listingTitle, variant, isBuy, form]);

  const onSubmit = form.handleSubmit((values) => {
    submit.mutate(values, {
      onSuccess: (result) => {
        onOpenChange(false);
        const params = new URLSearchParams({
          email: result.email,
          quote: result.quoteNumber,
          name: values.name,
          phone: values.phone,
          intent: result.intent.toLowerCase(),
          listingId: listing.id,
          slug: listing.slug,
        });
        router.push(`/inquiry/success?${params.toString()}`);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isBuy ? 'Buy this vehicle' : 'Book this vehicle'}
          </DialogTitle>
          <DialogDescription>
            {isBuy
              ? `Share your details and we will email the vehicle price and payment instructions for ${listing.listingTitle}.`
              : `Share your details and we will email the vehicle price and booking fee for ${listing.listingTitle}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" {...form.register('intent')} />
          <input type="hidden" {...form.register('listingId')} />

          <div className="space-y-2">
            <Label htmlFor="inquiry-name">Full name</Label>
            <Input id="inquiry-name" {...form.register('name')} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inquiry-phone">Phone</Label>
              <Input id="inquiry-phone" {...form.register('phone')} />
              {form.formState.errors.phone ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry-email">Email</Label>
              <Input
                id="inquiry-email"
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={form.watch('country')}
                onValueChange={(value) =>
                  form.setValue('country', value, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buyer type</Label>
              <Select
                value={form.watch('buyerType')}
                onValueChange={(value) =>
                  form.setValue(
                    'buyerType',
                    value as InquiryInput['buyerType'],
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Message (optional)</Label>
            <Textarea
              id="inquiry-message"
              rows={3}
              {...form.register('message')}
            />
          </div>

          <Button
            type="submit"
            disabled={submit.isPending}
            className="h-10 w-full rounded-full text-white"
            style={{ backgroundColor: brand.forest }}
          >
            {submit.isPending
              ? 'Sending…'
              : isBuy
                ? 'Submit & get purchase details'
                : 'Submit & get booking details'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
