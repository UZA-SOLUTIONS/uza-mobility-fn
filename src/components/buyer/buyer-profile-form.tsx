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
  requiresOrganizationName,
  updateBuyerProfileSchema,
  type CreateBuyerProfileFormValues,
  type CreateBuyerProfileInput,
  type UpdateBuyerProfileFormValues,
  type UpdateBuyerProfileInput,
} from '@/schemas/buyer';

function formatBuyerType(type: string) {
  return type.replaceAll('_', ' ');
}

function organizationRequired(buyerType: string | undefined) {
  return Boolean(
    buyerType &&
    requiresOrganizationName(
      buyerType as CreateBuyerProfileFormValues['buyerType'],
    ),
  );
}

type BuyerProfileFieldsProps = {
  buyerType: string;
  register: ReturnType<
    typeof useForm<CreateBuyerProfileFormValues>
  >['register'];
  errors: Record<string, { message?: string } | undefined>;
  idPrefix: string;
};

function BuyerProfileFields({
  buyerType,
  register,
  errors,
  idPrefix,
}: BuyerProfileFieldsProps) {
  const needsOrganization = organizationRequired(buyerType);

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-org`}>
          {needsOrganization
            ? 'Organization name'
            : 'Organization name (optional)'}
        </Label>
        <Input
          id={`${idPrefix}-org`}
          placeholder={
            needsOrganization
              ? 'Company or association name'
              : 'Leave blank if buying as an individual'
          }
          {...register('organizationName')}
        />
        {errors.organizationName?.message ? (
          <p className="text-xs text-destructive">
            {errors.organizationName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-tax`}>Tax ID (optional)</Label>
        <Input
          id={`${idPrefix}-tax`}
          placeholder="TIN or tax registration number"
          {...register('taxId')}
        />
        {errors.taxId?.message ? (
          <p className="text-xs text-destructive">{errors.taxId.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-address`}>Address (optional)</Label>
        <Input
          id={`${idPrefix}-address`}
          placeholder="Street address for delivery or billing"
          {...register('address')}
        />
        {errors.address?.message ? (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-city`}>City</Label>
          <Input id={`${idPrefix}-city`} {...register('city')} />
          {errors.city?.message ? (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-country`}>Country (ISO)</Label>
          <Input
            id={`${idPrefix}-country`}
            maxLength={2}
            placeholder="RW"
            {...register('country')}
          />
          {errors.country?.message ? (
            <p className="text-xs text-destructive">{errors.country.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-national-id`}>
            National ID (optional)
          </Label>
          <Input id={`${idPrefix}-national-id`} {...register('nationalId')} />
          {errors.nationalId?.message ? (
            <p className="text-xs text-destructive">
              {errors.nationalId.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-passport`}>
            Passport number (optional)
          </Label>
          <Input id={`${idPrefix}-passport`} {...register('passportNumber')} />
          {errors.passportNumber?.message ? (
            <p className="text-xs text-destructive">
              {errors.passportNumber.message}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

export function BuyerProfileForm() {
  const { user } = useSessionUser();
  const hasProfile = Boolean(user?.buyerProfile);
  const create = useCreateBuyerProfile();
  const update = useUpdateBuyerProfile();

  const createForm = useForm<CreateBuyerProfileFormValues>({
    resolver: zodResolver(createBuyerProfileSchema),
    defaultValues: {
      buyerType: 'INDIVIDUAL',
      organizationName: '',
      taxId: '',
      address: '',
      city: 'Kigali',
      country: 'RW',
      nationalId: '',
      passportNumber: '',
    },
  });

  const updateForm = useForm<UpdateBuyerProfileFormValues>({
    resolver: zodResolver(updateBuyerProfileSchema),
    defaultValues: {},
  });

  const createBuyerType = createForm.watch('buyerType');
  const updateBuyerType = updateForm.watch('buyerType') ?? 'INDIVIDUAL';

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
        p.buyerType as CreateBuyerProfileFormValues['buyerType'],
      )
        ? (p.buyerType as CreateBuyerProfileFormValues['buyerType'])
        : 'INDIVIDUAL',
      organizationName: p.organizationName ?? '',
      taxId: p.taxId ?? '',
      address: p.address ?? '',
      city: p.city ?? '',
      country: p.country ?? 'RW',
      nationalId: p.nationalId ?? '',
      passportNumber: p.passportNumber ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Required before booking a vehicle. Fields marked optional can be left
          blank; empty values are not sent to the server.
        </p>

        <div className="space-y-1.5">
          <Label>Buyer type</Label>
          <Select
            value={createBuyerType}
            onValueChange={(v) =>
              createForm.setValue(
                'buyerType',
                v as CreateBuyerProfileFormValues['buyerType'],
                { shouldValidate: true },
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {buyerTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {formatBuyerType(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {createForm.formState.errors.buyerType?.message ? (
            <p className="text-xs text-destructive">
              {createForm.formState.errors.buyerType.message}
            </p>
          ) : null}
        </div>

        <BuyerProfileFields
          buyerType={createBuyerType}
          register={createForm.register}
          errors={createForm.formState.errors}
          idPrefix="create"
        />

        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Creating…' : 'Create buyer profile'}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={updateForm.handleSubmit((values) =>
        update.mutate(updateBuyerProfileSchema.parse(values)),
      )}
    >
      <div className="space-y-1.5">
        <Label>Buyer type</Label>
        <Select
          value={updateBuyerType}
          onValueChange={(v) =>
            updateForm.setValue(
              'buyerType',
              v as UpdateBuyerProfileInput['buyerType'],
              { shouldValidate: true },
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {buyerTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {formatBuyerType(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <BuyerProfileFields
        buyerType={updateBuyerType}
        register={updateForm.register as BuyerProfileFieldsProps['register']}
        errors={updateForm.formState.errors}
        idPrefix="update"
      />

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? 'Saving…' : 'Save buyer profile'}
      </Button>
    </form>
  );
}
