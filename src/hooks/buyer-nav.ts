'use client';

import { buyerNavGroups, type NavGroup } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';

export function useBuyerNav() {
  const { hasSellerWorkspace, hasOperatorWorkspace, user, isLoading } =
    usePermissions();

  const groups: NavGroup[] = buyerNavGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }));

  if (hasSellerWorkspace) {
    groups.push({
      label: 'Selling',
      items: [{ label: 'Seller workspace', href: workspaceRoutes.seller }],
    });
  }

  if (hasOperatorWorkspace) {
    groups.push({
      label: 'Charging',
      items: [{ label: 'Operator workspace', href: workspaceRoutes.operator }],
    });
  }

  return {
    groups,
    isLoading,
    user,
  };
}
