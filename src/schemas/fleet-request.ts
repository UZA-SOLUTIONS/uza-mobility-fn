import { z } from 'zod';

export const FLEET_SIZE_OPTIONS = [
  { label: '2–5 vehicles', value: 5 },
  { label: '6–10 vehicles', value: 10 },
  { label: '11–25 vehicles', value: 25 },
  { label: '26–50 vehicles', value: 50 },
  { label: '51+ vehicles', value: 100 },
] as const;

export const fleetRequestSchema = z.object({
  contactPerson: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  organizationName: z.string().trim().min(2, 'Enter your company name'),
  phoneCountryCode: z
    .string()
    .trim()
    .min(2, 'Enter your country code (e.g. +250)')
    .max(6, 'Country code is too long')
    .regex(/^\+[0-9]+$/, 'Enter a valid country code like +250'),
  phoneNumber: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Phone number is too long'),
  vehicleCategoryId: z.string().min(1, 'Select a vehicle category'),
  quantity: z.number().int().min(2, 'Select fleet size'),
  notes: z.string().trim().max(2000).optional(),
});

export type FleetRequestInput = z.infer<typeof fleetRequestSchema>;
