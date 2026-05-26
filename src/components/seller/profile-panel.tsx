'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountProfileForm } from '@/components/account/account-profile-form';
import { PageHeader } from '@/components/shared/page-header';
import { SellerStatusBanner } from '@/components/seller/seller-status-banner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  allMeSellers,
  formatSellerChannel,
  isMarketplaceSellerType,
  marketplaceMeSeller,
} from '@/lib/auth/seller-profiles';
import { useSessionUser } from '@/hooks/session-user';
import {
  useCreateSellerProfile,
  useUpdateSellerProfile,
} from '@/queries/seller';
import {
  createSellerProfileSchema,
  marketplaceListingSellerTypes,
  type CreateSellerProfileInput,
} from '@/schemas/seller';
import {
  updateSellerProfileSchema,
  type UpdateSellerProfileInput,
} from '@/schemas/profile';

export function SellerProfilePanel() {
  const { user } = useSessionUser();
  const marketplaceProfile = marketplaceMeSeller(user);
  const updateProfile = useUpdateSellerProfile();
  const createProfile = useCreateSellerProfile();

  const updateForm = useForm<UpdateSellerProfileInput>({
    resolver: zodResolver(updateSellerProfileSchema),
    defaultValues: {},
  });

  const createForm = useForm<CreateSellerProfileInput>({
    resolver: zodResolver(createSellerProfileSchema),
    defaultValues: {
      sellerType: 'LOCAL_SELLER',
      businessName: '',
      country: 'RW',
      city: 'Kigali',
    },
  });

  const marketplaceProfileKey = marketplaceProfile
    ? [
        marketplaceProfile.id,
        marketplaceProfile.businessName,
        marketplaceProfile.contactPerson,
        marketplaceProfile.phone,
        marketplaceProfile.email,
        marketplaceProfile.address,
        marketplaceProfile.city,
        marketplaceProfile.description,
      ].join('|')
    : null;

  useEffect(() => {
    if (!marketplaceProfile) return;
    updateForm.reset({
      sellerType: isMarketplaceSellerType(marketplaceProfile.sellerType)
        ? (marketplaceProfile.sellerType as UpdateSellerProfileInput['sellerType'])
        : undefined,
      businessName: marketplaceProfile.businessName ?? '',
      contactPerson: marketplaceProfile.contactPerson ?? '',
      phone: marketplaceProfile.phone ?? '',
      email: marketplaceProfile.email ?? '',
      address: marketplaceProfile.address ?? '',
      city: marketplaceProfile.city ?? '',
      description: marketplaceProfile.description ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, marketplaceProfileKey]);

  const otherProfiles = allMeSellers(user).filter(
    (s) => !isMarketplaceSellerType(s.sellerType),
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Profile"
        description="Manage your personal account and marketplace seller details."
      />

      <SellerStatusBanner />

      <AccountProfileForm />

      <section className="space-y-4 border-t pt-8">
        <h2 className="text-lg font-semibold">Seller business</h2>
        <p className="text-sm text-muted-foreground">
          Business information shown to buyers and used for verification.
        </p>

        {otherProfiles.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            You also have:{' '}
            {otherProfiles
              .map((s) => formatSellerChannel(s.sellerType))
              .join(', ')}
            . Those channels are managed by UZA staff.
          </p>
        ) : null}

        {marketplaceProfile ? (
          <form
            className="space-y-4"
            onSubmit={updateForm.handleSubmit((values) =>
              updateProfile.mutate({
                ...values,
                sellerType:
                  marketplaceProfile.sellerType as UpdateSellerProfileInput['sellerType'],
                email: values.email?.trim() || undefined,
              }),
            )}
          >
            <div className="space-y-1.5">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                {...updateForm.register('businessName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-person">Contact person</Label>
                <Input
                  id="contact-person"
                  {...updateForm.register('contactPerson')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller-phone">Phone</Label>
                <Input id="seller-phone" {...updateForm.register('phone')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seller-email">Business email</Label>
              <Input
                id="seller-email"
                type="email"
                {...updateForm.register('email')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="seller-city">City</Label>
                <Input id="seller-city" {...updateForm.register('city')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller-address">Address</Label>
                <Input
                  id="seller-address"
                  {...updateForm.register('address')}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seller-desc">Description</Label>
              <Textarea
                id="seller-desc"
                rows={3}
                {...updateForm.register('description')}
              />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4 rounded-lg border bg-card p-6"
            onSubmit={createForm.handleSubmit((values) =>
              createProfile.mutate(createSellerProfileSchema.parse(values)),
            )}
          >
            <h2 className="text-lg font-semibold">
              Create marketplace profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Register as a local or international seller to list vehicles and
              parts on UZA Mobility.
            </p>
            <div className="space-y-1.5">
              <Label>Seller type</Label>
              <Select
                value={createForm.watch('sellerType')}
                onValueChange={(value) =>
                  createForm.setValue(
                    'sellerType',
                    value as CreateSellerProfileInput['sellerType'],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {marketplaceListingSellerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatSellerChannel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-business-name">Business name</Label>
              <Input
                id="new-business-name"
                {...createForm.register('businessName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-country">Country (ISO)</Label>
                <Input
                  id="new-country"
                  maxLength={2}
                  {...createForm.register('country')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-city">City</Label>
                <Input id="new-city" {...createForm.register('city')} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-desc">Description</Label>
              <Textarea
                id="new-desc"
                rows={3}
                {...createForm.register('description')}
              />
            </div>
            <Button type="submit" disabled={createProfile.isPending}>
              {createProfile.isPending ? 'Creating…' : 'Create profile'}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
