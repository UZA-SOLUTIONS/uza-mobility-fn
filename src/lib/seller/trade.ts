import type { MeSellerProfile } from '@/types/auth/seller-profile';

export function canSellerTrade(profile: MeSellerProfile | null | undefined) {
  if (!profile) return false;
  return profile.status === 'ACTIVE' && profile.isVerified;
}

export function sellerTradeBlockedMessage(
  profile: MeSellerProfile | null | undefined,
) {
  if (!profile) {
    return 'Complete your seller profile to manage inventory.';
  }
  if (profile.status === 'SUSPENDED') {
    return 'Your seller account is suspended. Contact UZA support.';
  }
  if (profile.status === 'REJECTED') {
    return 'Your seller application was rejected. Contact UZA support.';
  }
  if (profile.status === 'PENDING' || !profile.isVerified) {
    return 'Your seller account must be verified before you can manage listings or parts.';
  }
  return null;
}
