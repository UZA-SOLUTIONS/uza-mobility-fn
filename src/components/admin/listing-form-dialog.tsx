'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PendingPhotoPicker } from '@/components/shared/pending-photo-picker';
import {
  pendingPhotoFiles,
  revokePendingPhotos,
  type PendingPhoto,
} from '@/lib/pending-photos';
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
import { useAdminCategories, useCreateAdminListing } from '@/queries/admin';
import {
  adminCreateListingSchema,
  adminListingInitialStatuses,
  adminListingSellerTypes,
  listingConditions,
  MAX_LISTING_PHOTOS,
  type AdminCreateListingInput,
} from '@/schemas/admin';

type ListingFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ListingFormDialog({
  open,
  onOpenChange,
}: ListingFormDialogProps) {
  const create = useCreateAdminListing();
  const { data: categories } = useAdminCategories({ isActive: true }, open);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);

  const form = useForm<AdminCreateListingInput>({
    resolver: zodResolver(adminCreateListingSchema),
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
    setPhotos((current) => {
      revokePendingPhotos(current);
      return [];
    });
  }, [open, form]);

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      { body: values, photos: pendingPhotoFiles(photos) },
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
          <DialogTitle>New platform listing</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Each inventory channel uses its own seller profile on your account
          (e.g. Rwanda stock vs China sourcing). The listing is created under
          the profile for the channel you select.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Inventory channel</Label>
              <Select
                value={sellerType}
                onValueChange={(value) => {
                  form.setValue(
                    'sellerType',
                    value as AdminCreateListingInput['sellerType'],
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
            <div className="space-y-1.5">
              <Label>Initial status</Label>
              <Select
                value={form.watch('initialStatus')}
                onValueChange={(value) =>
                  form.setValue(
                    'initialStatus',
                    value as AdminCreateListingInput['initialStatus'],
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
                    value as AdminCreateListingInput['condition'],
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

          <PendingPhotoPicker
            photos={photos}
            onChange={setPhotos}
            maxPhotos={MAX_LISTING_PHOTOS}
            label="Listing photos"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              Create listing
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
