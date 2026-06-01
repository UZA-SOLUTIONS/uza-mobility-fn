/** Public marketplace listing shape returned by GET /listings* endpoints. */

export type PublicListingPhoto = {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
};

export type PublicListingEvSpec = {
  batteryCapacityKwh?: number | null;
  batteryHealthPercent?: number | null;
  rangeKm?: number | null;
  chargingType?: string | null;
  fastChargingSupported?: boolean;
};

export type PublicListingPricing = {
  finalPriceUsd: number;
  currency: string;
};

export type PublicListingCategory = {
  id: string;
  name: string;
  slug: string;
  type?: string;
};

export type PublicListingSeller = {
  businessName: string;
  country: string;
  city?: string | null;
  isVerified: boolean;
};

export type PublicListingUseCaseTag = {
  useCase: string;
};

export type PublicListing = {
  id: string;
  listingTitle: string;
  slug: string;
  brand: string;
  model: string;
  trim?: string | null;
  manufacturingYear: number;
  status: string;
  sellerType?: string;
  bodyType?: string | null;
  condition?: string | null;
  mileageKm?: number | null;
  color?: string | null;
  seats?: number | null;
  isNew?: boolean;
  videoUrl?: string | null;
  city?: string | null;
  country?: string;
  drivetrain?: string | null;
  deliveryEstimateDays?: number | null;
  description?: string | null;
  listingPricing?: PublicListingPricing | null;
  photos?: PublicListingPhoto[];
  evSpecs?: PublicListingEvSpec & { chargingTimeHours?: number | null };
  category?: PublicListingCategory | null;
  subcategory?: { id: string; name: string; slug: string } | null;
  displayBadge?: string | null;
  useCaseTags?: PublicListingUseCaseTag[];
  seller?: PublicListingSeller | null;
};
