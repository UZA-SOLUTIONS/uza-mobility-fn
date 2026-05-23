export type BuyerType = 'INDIVIDUAL' | 'ORGANIZATION' | string;

export type MeBuyerProfile = {
  id: string;
  buyerType: BuyerType;
  organizationName: string | null;
  city: string | null;
  country: string;
  isVerified: boolean;
};
