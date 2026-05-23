import type { MeBuyerProfile } from './buyer-profile';
import type { MeSellerProfile } from './seller-profile';
import type { PlatformRole } from './role';

export type MeUser = {
  id: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferredLanguage: string;
  profilePhoto: string | null;
  roles: PlatformRole[];
  permissions: string[];
  buyerProfile: MeBuyerProfile | null;
  seller: MeSellerProfile | null;
  createdAt: string;
  updatedAt: string;
};

export function isMeUser(value: unknown): value is MeUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Record<string, unknown>;
  return typeof user.id === 'string' && Array.isArray(user.permissions);
}
