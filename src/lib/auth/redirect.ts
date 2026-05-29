import { workspaceRoutes } from '@/config/routes';
import {
  canAccessOperatorPath,
  hasAdminAccess,
  hasBuyerWorkspace,
  hasOperatorWorkspace,
  hasSellerWorkspace,
} from '@/lib/permissions';
import type { MeUser } from '@/types/auth/me-user';

function pathStartsWith(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** Whether this signed-in user may open a protected workspace path. */
export function canAccessWorkspacePath(me: MeUser, path: string): boolean {
  if (pathStartsWith(path, workspaceRoutes.admin)) {
    return hasAdminAccess(me.permissions, me.roles);
  }
  if (pathStartsWith(path, workspaceRoutes.account)) {
    return hasBuyerWorkspace(me.permissions, me.roles);
  }
  if (pathStartsWith(path, workspaceRoutes.seller)) {
    return hasSellerWorkspace(me.permissions, me.seller, me.sellers);
  }
  if (pathStartsWith(path, workspaceRoutes.operator)) {
    return canAccessOperatorPath(me, path);
  }
  return true;
}

/**
 * After login, honor callbackUrl only when the user is allowed on that workspace.
 * Prevents admins being sent to /account via a stale callbackUrl query param.
 */
export function resolvePostLoginRedirect(
  me: MeUser,
  callbackUrl?: string | null,
): string {
  const fallback = authRedirect(me);
  if (!callbackUrl?.startsWith('/')) {
    return fallback;
  }
  if (canAccessWorkspacePath(me, callbackUrl)) {
    return callbackUrl;
  }
  return fallback;
}

export function authRedirect(me: MeUser): string {
  // Staff always wins — incl. super admin (`*`) and users with both SELLER + staff roles.
  if (hasAdminAccess(me.permissions, me.roles)) {
    return workspaceRoutes.admin;
  }

  const isSeller = hasSellerWorkspace(me.permissions, me.seller, me.sellers);
  const isBuyer = hasBuyerWorkspace(me.permissions, me.roles);
  const isOperator = hasOperatorWorkspace(me.permissions, me.roles);

  if (isSeller && !isBuyer) {
    return workspaceRoutes.seller;
  }

  if (isOperator && !isSeller && !isBuyer) {
    return workspaceRoutes.operator;
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
