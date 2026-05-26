import { workspaceRoutes } from '@/config/routes';
import {
  hasAdminAccess,
  hasBuyerWorkspace,
  hasSellerWorkspace,
} from '@/lib/permissions';
import type { MeUser } from '@/types/auth/me-user';

export function authRedirect(me: MeUser): string {
  // Staff always wins — incl. super admin (`*`) and users with both SELLER + staff roles.
  if (hasAdminAccess(me.permissions, me.roles)) {
    return workspaceRoutes.admin;
  }

  const isSeller = hasSellerWorkspace(me.permissions, me.seller, me.sellers);
  const isBuyer = hasBuyerWorkspace(me.permissions, me.roles);

  if (isSeller && !isBuyer) {
    return workspaceRoutes.seller;
  }

  if (isBuyer && !isSeller) {
    return workspaceRoutes.account;
  }

  if (isSeller && isBuyer) {
    return workspaceRoutes.account;
  }

  if (isSeller) {
    return workspaceRoutes.seller;
  }

  return workspaceRoutes.account;
}
