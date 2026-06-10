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

export type PartCondition = 'NEW' | 'USED' | 'REFURBISHED';

export type PartStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

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
  _count?: { listings: number };
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
