import { z } from 'zod';

export const listingConditions = [
  'NEW',
  'EXCELLENT',
  'VERY_GOOD',
  'GOOD',
  'FAIR',
  'NEEDS_REVIEW',
] as const;

/** Stored on listing EV specs (`EvSpec.chargingType`). */
export const listingChargingTypes = [
  'AC_TYPE1',
  'AC_TYPE2',
  'DC_CCS',
  'DC_CHADEMO',
  'DC_GB_T',
  'TESLA_NACS',
  'AC',
  'DC',
] as const;

export type ListingChargingType = (typeof listingChargingTypes)[number];

export function formatListingChargingType(value: string): string {
  return value.replaceAll('_', ' ');
}

/** Matches backend multipart limit for seller/admin part photos. */
export const MAX_PART_PHOTOS = 10;

export const partConditions = ['NEW', 'USED', 'REFURBISHED'] as const;

export const createPartSchema = z.object({
  name: z.string().min(1).max(200),
  categorySlug: z.string().min(1).max(100),
  condition: z.enum(partConditions),
  priceUsd: z.number().min(0),
  stockQuantity: z.number().int().min(0),
  description: z.string().max(5000).optional(),
  deliveryEstimate: z.string().max(200).optional(),
});

export type CreatePartInput = z.infer<typeof createPartSchema>;

export const updatePartSchema = createPartSchema.partial();

export type UpdatePartInput = z.infer<typeof updatePartSchema>;
