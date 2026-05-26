import type { AdminListingFormInput } from '@/schemas/admin';
import { listingConditions } from '@/schemas/admin';
import type { AdminListing } from '@/types/admin/marketplace';

function parseListingCondition(
  value: string | undefined,
): AdminListingFormInput['condition'] {
  if (value && (listingConditions as readonly string[]).includes(value)) {
    return value as AdminListingFormInput['condition'];
  }
  return 'NEW';
}

export function canAdminEditOwnListing(
  listing: AdminListing,
  adminUserId: string | undefined,
): boolean {
  if (!adminUserId || !listing.createdBy) {
    return false;
  }

  if (listing.createdBy.id !== adminUserId) {
    return false;
  }

  return (
    listing.sellerType === 'UZA_RWANDA_STOCK' ||
    listing.sellerType === 'UZA_CHINA_SOURCING'
  );
}

export function adminListingToFormValues(
  listing: AdminListing,
): AdminListingFormInput {
  const sellerType =
    listing.sellerType === 'UZA_CHINA_SOURCING'
      ? 'UZA_CHINA_SOURCING'
      : 'UZA_RWANDA_STOCK';

  return {
    sellerType,
    listingTitle: listing.listingTitle,
    categoryId: listing.category.id,
    subcategoryId: listing.subcategory?.id ?? '',
    brand: listing.brand,
    model: listing.model,
    trim: listing.trim ?? '',
    manufacturingYear: listing.manufacturingYear,
    isNew: listing.isNew ?? true,
    condition: parseListingCondition(listing.condition),
    vehicleLocation: listing.vehicleLocation ?? '',
    city: listing.city ?? '',
    country: listing.country,
    description: listing.description ?? '',
    mileageKm: listing.mileageKm ?? undefined,
    basePriceUsd: listing.listingPricing?.basePriceUsd ?? undefined,
    fobPriceUsd: listing.listingPricing?.fobPriceUsd ?? undefined,
  };
}
