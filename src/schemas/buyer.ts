import { z } from 'zod';

export const buyerTypes = [
  'INDIVIDUAL',
  'BUSINESS',
  'FLEET_OPERATOR',
  'TAXI_ASSOCIATION',
  'NGO',
  'GOVERNMENT',
  'SCHOOL',
  'HOTEL',
  'LOGISTICS_COMPANY',
] as const;

export const createBuyerProfileSchema = z.object({
  buyerType: z.enum(buyerTypes),
  organizationName: z.string().max(255).optional(),
  taxId: z.string().max(255).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(255).optional(),
  country: z.string().length(2).optional(),
  nationalId: z.string().max(255).optional(),
  passportNumber: z.string().max(255).optional(),
});

export type CreateBuyerProfileInput = z.infer<typeof createBuyerProfileSchema>;

export const updateBuyerProfileSchema = createBuyerProfileSchema.partial();

export type UpdateBuyerProfileInput = z.infer<typeof updateBuyerProfileSchema>;

export const requestInvoiceSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  buyerAddress: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export type RequestInvoiceInput = z.infer<typeof requestInvoiceSchema>;

export const submitPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amountPaid: z.number().min(0),
  currency: z.string().max(8).optional(),
  bankName: z.string().max(200).optional(),
  transferReference: z.string().max(200).optional(),
  paymentDate: z.string().optional(),
  senderName: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;

export const financingRequestSchema = z
  .object({
    buyerName: z.string().min(1).max(200),
    phone: z.string().min(3).max(32),
    buyerType: z.enum(buyerTypes).optional(),
    invoiceId: z.string().optional(),
    listingId: z.string().optional(),
    preferredDepositUsd: z.number().min(0).optional(),
    preferredBankName: z.string().max(200).optional(),
    employmentStatus: z.string().max(200).optional(),
    organizationName: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
  })
  .refine((data) => Boolean(data.invoiceId?.trim() || data.listingId?.trim()), {
    message: 'Link an invoice or a listing',
    path: ['listingId'],
  });

export type FinancingRequestInput = z.infer<typeof financingRequestSchema>;
