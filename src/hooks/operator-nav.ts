'use client';

import { operatorNavGroups, type NavGroup } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';

export function useOperatorNav() {
  const {
    hasBuyerWorkspace,
    hasSellerWorkspace,
    hasOperatorWorkspace,
    user,
    isLoading,
  } = usePermissions();

  const groups: NavGroup[] = operatorNavGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }));

  if (hasBuyerWorkspace) {
    groups.push({
      label: 'Buying',
      items: [{ label: 'Buyer workspace', href: workspaceRoutes.account }],
    });
  }

  if (hasSellerWorkspace) {
    groups.push({
      label: 'Selling',
      items: [{ label: 'Seller workspace', href: workspaceRoutes.seller }],
    });
  }

  return {
    groups,
    user,
    isLoading,
    hasOperatorWorkspace,
  };
}
