'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExistingPhotosGrid } from '@/components/shared/existing-photos-grid';
import { PendingPhotoPicker } from '@/components/shared/pending-photo-picker';
import {
  pendingPhotoFiles,
  revokePendingPhotos,
  type PendingPhoto,
} from '@/lib/pending-photos';
import { adminListingToFormValues } from '@/lib/admin/listing-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdminCategories,
  useCreateAdminListing,
  useUpdateAdminListing,
} from '@/queries/admin';
import {
  adminCreateListingSchema,
  adminListingFormSchema,
  adminListingInitialStatuses,
  adminUpdateListingSchema,
  listingConditions,
  MAX_LISTING_PHOTOS,
  type AdminListingFormInput,
} from '@/schemas/admin';
import type { AdminListing } from '@/types/admin/marketplace';

type ListingFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: AdminListing | null;
};

export function ListingFormDialog({
  open,
  onOpenChange,
  listing = null,
}: ListingFormDialogProps) {
  const isEdit = Boolean(listing);
  const create = useCreateAdminListing();
  const update = useUpdateAdminListing();
  const { data: categories } = useAdminCategories({ isActive: true }, open);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [removedPhotoIds, setRemovedPhotoIds] = useState<string[]>([]);
  const existingPhotos = listing?.photos ?? [];
  const keptExistingPhotos = useMemo(
    () => existingPhotos.filter((photo) => !removedPhotoIds.includes(photo.id)),
    [existingPhotos, removedPhotoIds],
  );
  const remainingPhotoSlots = Math.max(
    0,
    MAX_LISTING_PHOTOS - keptExistingPhotos.length - photos.length,
  );
  const busy = create.isPending || update.isPending;

  const form = useForm<AdminListingFormInput>({
    resolver: zodResolver(adminListingFormSchema),
    defaultValues: {
      sellerType: 'UZA_RWANDA_STOCK',
      initialStatus: 'PUBLISHED',
      listingTitle: '',
      categoryId: '',
      subcategoryId: '',
      brand: '',
      model: '',
      trim: '',
      manufacturingYear: new Date().getFullYear(),
      isNew: true,
      condition: 'NEW',
      vehicleLocation: '',
      city: 'Kigali',
      country: 'RW',
      description: '',
    },
  });

  const sellerType = form.watch('sellerType');
  const categoryId = form.watch('categoryId');
  const selectedCategory = categories?.find(
    (category) => category.id === categoryId,
  );
  const subcategories = selectedCategory?.subcategories ?? [];

  useEffect(() => {
    if (!open) return;
    setPhotos((current) => {
      revokePendingPhotos(current);
      return [];
    });
    setRemovedPhotoIds([]);
    if (listing) {
      form.reset(adminListingToFormValues(listing));
    } else {
      form.reset({
        sellerType: 'UZA_RWANDA_STOCK',
        initialStatus: 'PUBLISHED',
        listingTitle: '',
        categoryId: '',
        subcategoryId: '',
        brand: '',
        model: '',
        trim: '',
        manufacturingYear: new Date().getFullYear(),
        isNew: true,
        condition: 'NEW',
        vehicleLocation: '',
        city: 'Kigali',
        country: 'RW',
        description: '',
      });
    }
  }, [open, listing, form]);

  const onSubmit = form.handleSubmit((values) => {
    const newPhotos = pendingPhotoFiles(photos);

    if (isEdit && listing) {
      const totalPhotosAfterSave = keptExistingPhotos.length + newPhotos.length;
      if (totalPhotosAfterSave < 1) {
        toast.error('Keep at least one photo, or upload a replacement.');
        return;
      }

      const body = adminUpdateListingSchema.parse({
        ...values,
        removePhotoIds:
          removedPhotoIds.length > 0 ? removedPhotoIds : undefined,
      });

      update.mutate(
        {
          id: listing.id,
          body,
          photos: newPhotos,
        },
        {
          onSuccess: () => {
            revokePendingPhotos(photos);
            setPhotos([]);
            onOpenChange(false);
          },
        },
      );
      return;
    }

    create.mutate(
      { body: adminCreateListingSchema.parse(values), photos: newPhotos },
      {
        onSuccess: () => {
          revokePendingPhotos(photos);
          setPhotos([]);
          onOpenChange(false);
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit platform listing' : 'New platform listing'}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {isEdit
            ? 'Update your UZA stock or sourcing listing. New photos are added to existing ones.'
            : 'Each inventory channel uses its own seller profile on your account (e.g. Rwanda stock vs China sourcing).'}
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Inventory channel</Label>
              <Select
                value={sellerType}
                disabled={isEdit}
                onValueChange={(value) => {
                  form.setValue(
                    'sellerType',
                    value as AdminListingFormInput['sellerType'],
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UZA_RWANDA_STOCK">
                    UZA Rwanda stock
                  </SelectItem>
                  <SelectItem value="UZA_CHINA_SOURCING">
                    UZA China sourcing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!isEdit ? (
              <div className="space-y-1.5">
                <Label>Initial status</Label>
                <Select
                  value={form.watch('initialStatus')}
                  onValueChange={(value) =>
                    form.setValue(
                      'initialStatus',
                      value as AdminListingFormInput['initialStatus'],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adminListingInitialStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replaceAll('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="listing-title">Title</Label>
            <Input id="listing-title" {...form.register('listingTitle')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  form.setValue('categoryId', value);
                  form.setValue('subcategoryId', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subcategory</Label>
              <Select
                value={form.watch('subcategoryId') ?? ''}
                onValueChange={(value) =>
                  form.setValue('subcategoryId', value === 'none' ? '' : value)
                }
                disabled={subcategories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...form.register('brand')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...form.register('model')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                {...form.register('manufacturingYear', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Condition</Label>
              <Select
                value={form.watch('condition')}
                onValueChange={(value) =>
                  form.setValue(
                    'condition',
                    value as AdminListingFormInput['condition'],
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {listingConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition.replaceAll('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                min={0}
                {...form.register('mileageKm', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="location">Vehicle location</Label>
              <Input id="location" {...form.register('vehicleLocation')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...form.register('city')} />
            </div>
          </div>

          {sellerType === 'UZA_RWANDA_STOCK' ? (
            <div className="space-y-1.5">
              <Label htmlFor="base-price">Base price (USD)</Label>
              <Input
                id="base-price"
                type="number"
                min={0}
                step="0.01"
                {...form.register('basePriceUsd', { valueAsNumber: true })}
              />
              {form.formState.errors.basePriceUsd ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.basePriceUsd.message}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="fob-price">FOB price (USD)</Label>
              <Input
                id="fob-price"
                type="number"
                min={0}
                step="0.01"
                {...form.register('fobPriceUsd', { valueAsNumber: true })}
              />
              {form.formState.errors.fobPriceUsd ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.fobPriceUsd.message}
                </p>
              ) : null}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="listing-desc">Description</Label>
            <Textarea
              id="listing-desc"
              rows={3}
              {...form.register('description')}
            />
          </div>

          {isEdit ? (
            <ExistingPhotosGrid
              photos={keptExistingPhotos}
              hint="Remove photos with ×, or add more below. At least one photo is required."
              onRemovePhoto={(photoId) =>
                setRemovedPhotoIds((current) =>
                  current.includes(photoId) ? current : [...current, photoId],
                )
              }
            />
          ) : null}

          {isEdit &&
          existingPhotos.length > 0 &&
          keptExistingPhotos.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              All current photos marked for removal. Upload at least one new
              photo before saving.
            </p>
          ) : null}

          <PendingPhotoPicker
            photos={photos}
            onChange={setPhotos}
            maxPhotos={isEdit ? remainingPhotoSlots : MAX_LISTING_PHOTOS}
            label={isEdit ? 'Add photos' : 'Listing photos'}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create listing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
