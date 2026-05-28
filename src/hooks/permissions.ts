'use client';

import {
  can,
  canAny,
  hasAdminAccess,
  hasBuyerWorkspace,
  hasOperatorWorkspace,
  hasSellerWorkspace,
  isSuperAdmin,
} from '@/lib/permissions';
import { useSessionUser } from '@/hooks/session-user';

export function usePermissions() {
  const { user, isLoading } = useSessionUser();
  const permissions = user?.permissions ?? [];

  return {
    user,
    isLoading,
    permissions,
    can: (action: string) => can(permissions, action),
    canAny: (actions: string[]) => canAny(permissions, actions),
    isSuperAdmin: isSuperAdmin(permissions),
    hasAdminAccess: hasAdminAccess(permissions, user?.roles),
    hasSellerWorkspace: hasSellerWorkspace(
      permissions,
      user?.seller,
      user?.sellers,
    ),
    hasOperatorWorkspace: hasOperatorWorkspace(permissions, user?.roles),
    hasBuyerWorkspace: hasBuyerWorkspace(permissions, user?.roles),
  };
}
