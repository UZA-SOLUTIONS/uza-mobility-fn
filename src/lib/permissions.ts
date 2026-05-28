import type { PlatformRole } from '@/types/auth/role';

/** Staff roles that use the /admin workspace (not marketplace sellers or buyers). */
export const PLATFORM_STAFF_ROLES: PlatformRole[] = [
  'SUPER_ADMIN',
  'MARKETPLACE_ADMIN',
  'FINANCE_ADMIN',
  'LOGISTICS_ADMIN',
  'FLEET_ADMIN',
  'SUSTAINABILITY_ADMIN',
  'ADVERTISING_ADMIN',
  'SALES_AGENT',
];

/** Permissions that only platform staff hold — excludes buyer/seller overlaps (e.g. orders:read). */
const ADMIN_PERMISSION_MARKERS = [
  'listings:approve',
  'listings:reject',
  'listings:feature',
  'listings:delete',
  'payments:verify',
  'payments:reject',
  'payments:refund',
  'invoices:send',
  'invoices:cancel',
  'financing:read',
  'financing:send-to-bank',
  'fleet:read',
  'fleet:update-status',
  'promotions:create',
  'promotions:manage',
  'sustainability:read',
  'sustainability:manage',
  'sellers:verify',
  'sellers:suspend',
  'users:manage-roles',
  'users:read',
  'orders:update-status',
  'invoices:read',
  'parts:manage',
  'stations:read-all',
  'stations:approve',
  'stations:reject',
  'stations:suspend',
] as const;

export function can(permissions: string[], action: string): boolean {
  if (permissions.includes('*')) return true;
  return permissions.includes(action);
}

export function canAny(permissions: string[], actions: string[]): boolean {
  return actions.some((action) => can(permissions, action));
}

export function isSuperAdmin(permissions: string[]): boolean {
  return permissions.includes('*');
}

export function hasAdminAccess(
  permissions: string[],
  roles?: readonly string[] | null,
): boolean {
  if (isSuperAdmin(permissions)) return true;

  if (
    roles?.some((role) =>
      (PLATFORM_STAFF_ROLES as readonly string[]).includes(role),
    )
  ) {
    return true;
  }

  return permissions.some((permission) =>
    (ADMIN_PERMISSION_MARKERS as readonly string[]).includes(permission),
  );
}

export function hasSellerWorkspace(
  permissions: string[],
  seller: { id: string; sellerType?: string } | null | undefined,
  sellers?: { id: string; sellerType?: string }[] | null,
): boolean {
  const profiles = sellers?.length ? sellers : seller ? [seller] : [];
  const marketplace = profiles.find(
    (s) =>
      s.sellerType === 'LOCAL_SELLER' ||
      s.sellerType === 'INTERNATIONAL_SELLER',
  );
  if (!marketplace) return false;
  return canAny(permissions, ['listings:create', 'parts:create']);
}

const OPERATOR_WORKSPACE_PERMISSIONS = [
  'stations:create',
  'stations:update',
  'stations:submit',
  'stations:read-own',
] as const;

export function hasOperatorWorkspace(
  permissions: string[],
  roles?: readonly string[] | null,
): boolean {
  if (hasAdminAccess(permissions, roles)) {
    return false;
  }
  if (roles?.includes('CHARGING_OPERATOR')) {
    return true;
  }
  return canAny(permissions, [...OPERATOR_WORKSPACE_PERMISSIONS]);
}

const BUYER_WORKSPACE_PERMISSIONS = [
  'orders:read',
  'invoices:create',
  'payments:submit',
  'financing:submit',
] as const;

export function hasBuyerWorkspace(
  permissions: string[],
  roles?: readonly string[] | null,
): boolean {
  // Platform staff (incl. super admin with `*`) use /admin, not the buyer workspace.
  if (hasAdminAccess(permissions, roles)) {
    return false;
  }
  if (roles?.includes('BUYER')) {
    return true;
  }
  return canAny(permissions, [...BUYER_WORKSPACE_PERMISSIONS]);
}
