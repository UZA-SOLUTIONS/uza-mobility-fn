import { z } from 'zod';

export const inquirySchema = z.object({
  listingId: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(120),
  phone: z.string().min(6, 'Phone is required').max(30),
  email: z.email('Enter a valid email address'),
  country: z.string().length(2, 'Select a country'),
  buyerType: z.enum(['INDIVIDUAL', 'BUSINESS']),
  message: z.string().max(2000).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
