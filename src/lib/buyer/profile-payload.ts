import type {
  CreateBuyerProfileInput,
  UpdateBuyerProfileInput,
} from '@/schemas/buyer';

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === '' ? undefined : trimmed;
}

/** Omit empty strings so optional API fields are not sent as "". */
export function normalizeBuyerProfileBody<
  T extends CreateBuyerProfileInput | UpdateBuyerProfileInput,
>(body: T): T {
  const normalized = { ...body };

  if ('organizationName' in normalized) {
    normalized.organizationName = trimOptional(
      normalized.organizationName,
    ) as T extends CreateBuyerProfileInput
      ? CreateBuyerProfileInput['organizationName']
      : UpdateBuyerProfileInput['organizationName'];
  }
  if ('taxId' in normalized) {
    normalized.taxId = trimOptional(
      normalized.taxId,
    ) as typeof normalized.taxId;
  }
  if ('address' in normalized) {
    normalized.address = trimOptional(
      normalized.address,
    ) as typeof normalized.address;
  }
  if ('city' in normalized && typeof normalized.city === 'string') {
    normalized.city = normalized.city.trim() as typeof normalized.city;
  }
  if ('country' in normalized && typeof normalized.country === 'string') {
    normalized.country = normalized.country
      .trim()
      .toUpperCase() as typeof normalized.country;
  }
  if ('nationalId' in normalized) {
    normalized.nationalId = trimOptional(
      normalized.nationalId,
    ) as typeof normalized.nationalId;
  }
  if ('passportNumber' in normalized) {
    normalized.passportNumber = trimOptional(
      normalized.passportNumber,
    ) as typeof normalized.passportNumber;
  }

  return normalized;
}
