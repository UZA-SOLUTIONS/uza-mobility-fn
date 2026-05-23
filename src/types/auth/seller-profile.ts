export type SellerType =
  | 'UZA_RWANDA_STOCK'
  | 'UZA_CHINA_SOURCING'
  | 'LOCAL_SELLER'
  | 'INTERNATIONAL_SELLER'
  | string;

export type SellerStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REJECTED'
  | string;

export type MeSellerProfile = {
  id: string;
  sellerType: SellerType;
  status: SellerStatus;
  businessName: string;
  city: string | null;
  country: string;
  isVerified: boolean;
  verifiedAt: string | null;
};
