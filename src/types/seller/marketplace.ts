import type { ListingStatus } from '@/types/admin/marketplace';

export type SellerListingPhoto = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
};

export type SellerListingCategory = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type SellerListingPricing = {
  finalPriceUsd: number;
  finalPriceRwf: number | null;
  currency: string;
  basePriceUsd?: number | null;
  fobPriceUsd?: number | null;
};

export type SellerListing = {
  id: string;
  listingTitle: string;
  slug: string;
  status: ListingStatus;
  brand: string;
  model: string;
  trim: string | null;
  manufacturingYear: number;
  isNew: boolean;
  condition: string;
  mileageKm: number | null;
  description: string | null;
  vehicleLocation: string | null;
  city: string | null;
  country: string;
  sellerType: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  category: SellerListingCategory;
  subcategory: { id: string; name: string; slug: string } | null;
  listingPricing: SellerListingPricing | null;
  photos: SellerListingPhoto[];
  rejectionReason?: string;
};

export type SellerPartPhoto = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export type SellerPart = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  condition: string;
  priceUsd: number;
  stockQuantity: number;
  stockLabel: string;
  deliveryEstimate: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  photos: SellerPartPhoto[];
};
