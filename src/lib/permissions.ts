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
  'parts:manage',
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

export function hasAdminAccess(permissions: string[]): boolean {
  if (isSuperAdmin(permissions)) return true;

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
