import { z } from 'zod';
import { listingConditions } from '@/schemas/admin';

export const marketplaceListingSellerTypes = [
  'LOCAL_SELLER',
  'INTERNATIONAL_SELLER',
] as const;

export const MAX_SELLER_LISTING_PHOTOS = 20;

const sellerListingFormFieldsSchema = z.object({
  sellerType: z.enum(marketplaceListingSellerTypes),
  listingTitle: z.string().min(1).max(200),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  trim: z.string().max(100).optional(),
  manufacturingYear: z.number().int().min(1990).max(2100),
  condition: z.enum(listingConditions),
  vehicleLocation: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  country: z.string().length(2),
  description: z.string().max(5000).optional(),
  mileageKm: z.number().min(0).optional(),
  sellerDesiredPayoutUsd: z.number().min(0).optional(),
  fobPriceUsd: z.number().min(0).optional(),
});

function refineSellerListingPricing(
  data: z.infer<typeof sellerListingFormFieldsSchema>,
  ctx: z.RefinementCtx,
) {
  if (
    data.sellerType === 'LOCAL_SELLER' &&
    (data.sellerDesiredPayoutUsd == null || data.sellerDesiredPayoutUsd <= 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'Desired payout (USD) is required for local sellers',
      path: ['sellerDesiredPayoutUsd'],
    });
  }
  if (
    data.sellerType === 'INTERNATIONAL_SELLER' &&
    (data.fobPriceUsd == null || data.fobPriceUsd <= 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'FOB price (USD) is required for international sellers',
      path: ['fobPriceUsd'],
    });
  }
}

export const sellerListingFormSchema =
  sellerListingFormFieldsSchema.superRefine(refineSellerListingPricing);

export type SellerListingFormInput = z.infer<typeof sellerListingFormSchema>;

export const createSellerListingSchema =
  sellerListingFormFieldsSchema.superRefine(refineSellerListingPricing);

export type CreateSellerListingInput = z.infer<
  typeof createSellerListingSchema
>;

export const updateSellerListingSchema =
  sellerListingFormFieldsSchema.superRefine(refineSellerListingPricing);

export type UpdateSellerListingInput = z.infer<
  typeof updateSellerListingSchema
>;

export {
  listingConditions,
  MAX_PART_PHOTOS,
  partConditions,
  createPartSchema,
  updatePartSchema,
} from '@/schemas/admin';
export type { CreatePartInput, UpdatePartInput } from '@/schemas/admin';

export const createSellerProfileSchema = z.object({
  sellerType: z.enum(marketplaceListingSellerTypes),
  businessName: z.string().min(1).max(150),
  businessRegNumber: z.string().max(100).optional(),
  taxId: z.string().max(100).optional(),
  contactPerson: z.string().max(150).optional(),
  phone: z.string().max(32).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  country: z.string().length(2),
  description: z.string().max(1000).optional(),
});

export type CreateSellerProfileInput = z.infer<
  typeof createSellerProfileSchema
>;
