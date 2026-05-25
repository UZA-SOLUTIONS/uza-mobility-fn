'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useSessionUser } from '@/hooks/session-user';
import {
  useUpdateBuyerProfile,
  useUpdateProfile,
  useUpdateSellerProfile,
} from '@/queries/profile';
import { allMeSellers, formatSellerChannel } from '@/lib/auth/seller-profiles';
import {
  parseSellerProfileType,
  updateBuyerProfileSchema,
  updateProfileSchema,
  updateSellerProfileSchema,
  type UpdateBuyerProfileInput,
  type UpdateProfileInput,
  type UpdateSellerProfileInput,
} from '@/schemas/profile';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'rw', label: 'Kinyarwanda' },
] as const;

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ProfileSettingsForm() {
  const { user, isLoading } = useSessionUser();
  const updateProfile = useUpdateProfile();
  const updateBuyer = useUpdateBuyerProfile();
  const updateSeller = useUpdateSellerProfile();
  const [photo, setPhoto] = useState<File | undefined>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoPreviewRef = useRef<string | null>(null);
  const [sellerChannel, setSellerChannel] =
    useState<UpdateSellerProfileInput['sellerType']>();

  const setPreviewUrl = (url: string | null) => {
    if (
      photoPreviewRef.current?.startsWith('blob:') &&
      photoPreviewRef.current !== url
    ) {
      URL.revokeObjectURL(photoPreviewRef.current);
    }
    photoPreviewRef.current = url;
    setPhotoPreview(url);
  };

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      preferredLanguage: 'en',
    },
  });

  const buyerForm = useForm<UpdateBuyerProfileInput>({
    resolver: zodResolver(updateBuyerProfileSchema),
    defaultValues: {},
  });

  const sellerForm = useForm<UpdateSellerProfileInput>({
    resolver: zodResolver(updateSellerProfileSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
      preferredLanguage: (user.preferredLanguage as 'en' | 'fr' | 'rw') ?? 'en',
    });

    if (!photo) {
      setPreviewUrl(user.profilePhoto);
    }

    if (user.buyerProfile) {
      buyerForm.reset({
        organizationName: user.buyerProfile.organizationName ?? '',
        city: user.buyerProfile.city ?? '',
        country: user.buyerProfile.country ?? undefined,
      });
    }

    const sellerProfiles = allMeSellers(user);
    if (sellerProfiles.length > 0) {
      setSellerChannel((prev) => {
        if (prev && sellerProfiles.some((s) => s.sellerType === prev)) {
          return prev;
        }
        return parseSellerProfileType(sellerProfiles[0].sellerType);
      });
    }
    // Only re-sync when server user changes — not on every render (avoid wiping file preview).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- photo held locally until save
  }, [user?.id, user?.updatedAt, user?.profilePhoto]);

  useEffect(() => {
    if (!user || !sellerChannel) return;
    const profile = allMeSellers(user).find(
      (s) => s.sellerType === sellerChannel,
    );
    if (!profile) return;

    sellerForm.reset({
      businessName: profile.businessName ?? '',
      contactPerson: profile.contactPerson ?? '',
      phone: profile.phone ?? '',
      email: profile.email ?? '',
      address: profile.address ?? '',
      city: profile.city ?? '',
      description: profile.description ?? '',
    });
  }, [user?.id, user?.updatedAt, sellerChannel]);

  if (!user) {
    if (isLoading) {
      return <p className="text-sm text-muted-foreground">Loading profile…</p>;
    }
    return (
      <p className="text-sm text-muted-foreground">
        Sign in to manage your profile.
      </p>
    );
  }

  const profileBusy = updateProfile.isPending;
  const sellerProfiles = allMeSellers(user);
  const activeSellerProfile =
    sellerProfiles.find((s) => s.sellerType === sellerChannel) ??
    sellerProfiles[0];

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <form
          className="space-y-4"
          onSubmit={profileForm.handleSubmit((values) => {
            updateProfile.mutate(
              {
                body: {
                  ...values,
                  phone: values.phone?.trim() || undefined,
                },
                photo,
              },
              {
                onSuccess: (updated) => {
                  setPhoto(undefined);
                  setPreviewUrl(updated.profilePhoto);
                },
              },
            );
          })}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div
              className="relative size-20 shrink-0 overflow-hidden rounded-full border bg-muted"
              aria-hidden
            >
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob + arbitrary CDN URLs
                <img
                  src={photoPreview}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-lg font-medium text-muted-foreground">
                  {initials(
                    profileForm.watch('firstName') || user.firstName,
                    profileForm.watch('lastName') || user.lastName,
                  )}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="profile-photo">Profile photo</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" asChild>
                  <label htmlFor="profile-photo" className="cursor-pointer">
                    Choose image
                  </label>
                </Button>
                {photo ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPhoto(undefined);
                      setPreviewUrl(user.profilePhoto);
                    }}
                  >
                    Clear selection
                  </Button>
                ) : null}
              </div>
              <input
                id="profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPhoto(file);
                  if (!file) {
                    setPreviewUrl(user.profilePhoto);
                    return;
                  }
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />
              {photo ? (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {photo.name}
                  </span>{' '}
                  ready — click{' '}
                  <span className="font-medium">Save account</span> to upload.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, or GIF. Max size per server limits.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" {...profileForm.register('firstName')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" {...profileForm.register('lastName')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...profileForm.register('phone')} />
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select
                value={profileForm.watch('preferredLanguage')}
                onValueChange={(value) =>
                  profileForm.setValue(
                    'preferredLanguage',
                    value as UpdateProfileInput['preferredLanguage'],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">Email: {user.email}</p>

          <Button type="submit" disabled={profileBusy}>
            Save account
          </Button>
        </form>
      </section>

      {user.buyerProfile ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Buyer profile</h2>
          <form
            className="space-y-4"
            onSubmit={buyerForm.handleSubmit((values) =>
              updateBuyer.mutate({
                organizationName: values.organizationName?.trim() || undefined,
                address: values.address?.trim() || undefined,
                city: values.city?.trim() || undefined,
                country: values.country?.trim() || undefined,
              }),
            )}
          >
            <div className="space-y-1.5">
              <Label htmlFor="org-name">Organization</Label>
              <Input
                id="org-name"
                {...buyerForm.register('organizationName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="buyer-city">City</Label>
                <Input id="buyer-city" {...buyerForm.register('city')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buyer-country">Country (ISO)</Label>
                <Input
                  id="buyer-country"
                  maxLength={2}
                  {...buyerForm.register('country')}
                />
              </div>
            </div>
            <Button type="submit" disabled={updateBuyer.isPending}>
              Save buyer profile
            </Button>
          </form>
        </section>
      ) : null}

      {sellerProfiles.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Seller profile</h2>
          {sellerProfiles.length > 1 ? (
            <div className="space-y-1.5">
              <Label htmlFor="seller-channel">Inventory channel</Label>
              <Select
                value={sellerChannel || activeSellerProfile?.sellerType}
                onValueChange={(value) =>
                  setSellerChannel(parseSellerProfileType(value))
                }
              >
                <SelectTrigger id="seller-channel">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  {sellerProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.sellerType}>
                      {formatSellerChannel(profile.sellerType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <form
            className="space-y-4"
            onSubmit={sellerForm.handleSubmit((values) => {
              const sellerType =
                sellerChannel ??
                parseSellerProfileType(activeSellerProfile?.sellerType);
              if (!sellerType) return;

              updateSeller.mutate({
                sellerType,
                businessName: values.businessName?.trim() || undefined,
                contactPerson: values.contactPerson?.trim() || undefined,
                phone: values.phone?.trim() || undefined,
                email: values.email?.trim() || undefined,
                address: values.address?.trim() || undefined,
                city: values.city?.trim() || undefined,
                description: values.description?.trim() || undefined,
              });
            })}
          >
            <div className="space-y-1.5">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                {...sellerForm.register('businessName')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seller-desc">Description</Label>
              <Textarea
                id="seller-desc"
                rows={3}
                {...sellerForm.register('description')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="seller-contact">Contact person</Label>
                <Input
                  id="seller-contact"
                  {...sellerForm.register('contactPerson')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller-phone">Phone</Label>
                <Input id="seller-phone" {...sellerForm.register('phone')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="seller-email">Email</Label>
                <Input id="seller-email" {...sellerForm.register('email')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seller-city">City</Label>
                <Input id="seller-city" {...sellerForm.register('city')} />
              </div>
            </div>
            <Button type="submit" disabled={updateSeller.isPending}>
              Save seller profile
            </Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
