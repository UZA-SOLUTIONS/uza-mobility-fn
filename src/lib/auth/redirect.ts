import { workspaceRoutes } from '@/config/routes';
import { hasAdminAccess, hasSellerWorkspace } from '@/lib/permissions';
import type { MeUser } from '@/types/auth/me-user';

export function authRedirect(me: MeUser): string {
  if (hasAdminAccess(me.permissions)) {
    return workspaceRoutes.admin;
  }

  if (hasSellerWorkspace(me.permissions, me.seller, me.sellers)) {
    return workspaceRoutes.seller;
  }

  return workspaceRoutes.account;
}
