export const listingStatuses = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'SOLD',
  'RESERVED',
  'SUSPENDED',
  'REJECTED',
  'EXPIRED',
  'ARCHIVED',
] as const;

export type ListingStatus = (typeof listingStatuses)[number];

export const sellerStatuses = [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'REJECTED',
] as const;
export type SellerStatus = (typeof sellerStatuses)[number];

export const sellerTypes = [
  'UZA_RWANDA_STOCK',
  'UZA_CHINA_SOURCING',
  'LOCAL_SELLER',
  'INTERNATIONAL_SELLER',
] as const;

export type SellerType = (typeof sellerTypes)[number];

export type AdminListingSeller = {
  id: string;
  businessName: string;
  country: string;
  city: string | null;
  isVerified: boolean;
  userId: string;
};

export type AdminListingCategory = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type AdminListingPricing = {
  finalPriceUsd: number;
  finalPriceRwf: number | null;
  currency: string;
};

export type AdminListing = {
  id: string;
  listingTitle: string;
  slug: string;
  status: ListingStatus;
  brand: string;
  model: string;
  sellerType: SellerType;
  isFeatured: boolean;
  isHotDeal: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  adminNotes: string | null;
  seller: AdminListingSeller;
  category: AdminListingCategory;
  subcategory: { id: string; name: string; slug: string } | null;
  listingPricing: AdminListingPricing | null;
};

export type AdminListingsFilters = {
  status?: ListingStatus;
  sellerId?: string;
  page?: number;
  limit?: number;
};

export type AdminSellerUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isActive: boolean;
};

export type AdminSeller = {
  id: string;
  userId: string;
  sellerType: SellerType;
  status: SellerStatus;
  businessName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: AdminSellerUser;
  _count: { listings: number; parts: number };
};

export type AdminSellersFilters = {
  status?: SellerStatus;
  sellerType?: SellerType;
  isVerified?: boolean;
  q?: string;
  page?: number;
  limit?: number;
};

export type AdminPart = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  condition: string;
  priceUsd: number;
  stockQuantity: number;
  stockLabel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminPartsFilters = {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export type CategoryType =
  | 'PASSENGER_EV'
  | 'TWO_THREE_WHEEL'
  | 'COMMERCIAL_EV'
  | 'EV_PARTS_ACCESSORIES'
  | 'EV_INFRASTRUCTURE_ENERGY';

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description: string | null;
  iconUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
};
