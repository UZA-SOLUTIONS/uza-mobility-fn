'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionUser } from '@/hooks/session-user';
import { useCreateBuyerProfile, useUpdateBuyerProfile } from '@/queries/buyer';
import {
  buyerTypes,
  createBuyerProfileSchema,
  updateBuyerProfileSchema,
  type CreateBuyerProfileInput,
  type UpdateBuyerProfileInput,
} from '@/schemas/buyer';

export function BuyerProfileForm() {
  const { user } = useSessionUser();
  const hasProfile = Boolean(user?.buyerProfile);
  const create = useCreateBuyerProfile();
  const update = useUpdateBuyerProfile();

  const createForm = useForm<CreateBuyerProfileInput>({
    resolver: zodResolver(createBuyerProfileSchema),
    defaultValues: {
      buyerType: 'INDIVIDUAL',
      country: 'RW',
      city: 'Kigali',
    },
  });

  const updateForm = useForm<UpdateBuyerProfileInput>({
    resolver: zodResolver(updateBuyerProfileSchema),
    defaultValues: {},
  });

  const buyerProfileKey = user?.buyerProfile
    ? [
        user.buyerProfile.buyerType,
        user.buyerProfile.organizationName,
        user.buyerProfile.city,
        user.buyerProfile.country,
      ].join('|')
    : null;

  useEffect(() => {
    if (!user?.buyerProfile) return;
    const p = user.buyerProfile;
    updateForm.reset({
      buyerType: buyerTypes.includes(
        p.buyerType as CreateBuyerProfileInput['buyerType'],
      )
        ? (p.buyerType as CreateBuyerProfileInput['buyerType'])
        : 'INDIVIDUAL',
      organizationName: p.organizationName ?? '',
      city: p.city ?? '',
      country: p.country ?? 'RW',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when profile data changes, not when form identity changes
  }, [user?.id, buyerProfileKey]);

  if (!hasProfile) {
    return (
      <form
        className="space-y-4 rounded-lg border bg-card p-6"
        onSubmit={createForm.handleSubmit((values) =>
          create.mutate(createBuyerProfileSchema.parse(values)),
        )}
      >
        <h2 className="text-lg font-semibold">Complete buyer profile</h2>
        <p className="text-sm text-muted-foreground">
          Required before requesting invoices. Choose how you are buying on UZA
          Mobility.
        </p>
        <div className="space-y-1.5">
          <Label>Buyer type</Label>
          <Select
            value={createForm.watch('buyerType')}
            onValueChange={(v) =>
              createForm.setValue(
                'buyerType',
                v as CreateBuyerProfileInput['buyerType'],
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {buyerTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="org">Organization (optional)</Label>
          <Input id="org" {...createForm.register('organizationName')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="buyer-city">City</Label>
            <Input id="buyer-city" {...createForm.register('city')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="buyer-country">Country (ISO)</Label>
            <Input
              id="buyer-country"
              maxLength={2}
              {...createForm.register('country')}
            />
          </div>
        </div>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Creating…' : 'Create buyer profile'}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={updateForm.handleSubmit((values) => update.mutate(values))}
    >
      <div className="space-y-1.5">
        <Label>Buyer type</Label>
        <Select
          value={updateForm.watch('buyerType') ?? 'INDIVIDUAL'}
          onValueChange={(v) =>
            updateForm.setValue(
              'buyerType',
              v as UpdateBuyerProfileInput['buyerType'],
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {buyerTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t.replaceAll('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="org-upd">Organization</Label>
        <Input id="org-upd" {...updateForm.register('organizationName')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="city-upd">City</Label>
          <Input id="city-upd" {...updateForm.register('city')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country-upd">Country (ISO)</Label>
          <Input
            id="country-upd"
            maxLength={2}
            {...updateForm.register('country')}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address-upd">Address</Label>
        <Input id="address-upd" {...updateForm.register('address')} />
      </div>
      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? 'Saving…' : 'Save buyer profile'}
      </Button>
    </form>
  );
}
