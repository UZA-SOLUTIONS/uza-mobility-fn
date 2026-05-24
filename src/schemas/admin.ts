import { z } from 'zod';

export const rejectListingSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(2000),
});

export type RejectListingInput = z.infer<typeof rejectListingSchema>;

export const suspendSellerSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type SuspendSellerInput = z.infer<typeof suspendSellerSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(1).max(150),
  type: z.enum([
    'PASSENGER_EV',
    'TWO_THREE_WHEEL',
    'COMMERCIAL_EV',
    'EV_PARTS_ACCESSORIES',
    'EV_INFRASTRUCTURE_ENERGY',
  ]),
  description: z.string().optional(),
  iconUrl: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const createSubcategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
