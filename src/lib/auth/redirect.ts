import { workspaceRoutes } from '@/config/routes';
import {
  canAccessOperatorPath,
  hasBuyerWorkspace,
  hasMarketplaceWorkspace,
  hasOperatorWorkspace,
  hasSellerWorkspace,
  isStaffOnlyAccount,
} from '@/lib/permissions';
import type { MeUser } from '@/types/auth/me-user';

function pathStartsWith(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** Whether this signed-in user may open a protected workspace path. */
export function canAccessWorkspacePath(me: MeUser, path: string): boolean {
  if (isStaffOnlyAccount(me)) {
    return false;
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

/** Default destination for a signed-in marketplace user (buyer / seller / operator). */
export function authRedirect(me: MeUser): string {
  if (isStaffOnlyAccount(me) || !hasMarketplaceWorkspace(me)) {
    return '/';
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

  if (isBuyer) {
    return '/vehicles';
  }

  if (isSeller) {
    return workspaceRoutes.seller;
  }

  return '/vehicles';
}
