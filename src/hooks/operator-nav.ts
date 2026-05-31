'use client';

import { operatorNavGroups, type NavGroup } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';
import { ShoppingCart, Store } from 'lucide-react';

export function useOperatorNav() {
  const {
    hasBuyerWorkspace,
    hasSellerWorkspace,
    hasOperatorWorkspace,
    user,
    isLoading,
  } = usePermissions();

  const groups: NavGroup[] = operatorNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          hasOperatorWorkspace ||
          item.href !== workspaceRoutes.operatorStations,
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (hasBuyerWorkspace) {
    groups.push({
      label: 'Buying',
      items: [
        {
          label: 'Buyer workspace',
          href: workspaceRoutes.account,
          icon: ShoppingCart,
        },
      ],
    });
  }

  if (hasSellerWorkspace) {
    groups.push({
      label: 'Selling',
      items: [
        {
          label: 'Seller workspace',
          href: workspaceRoutes.seller,
          icon: Store,
        },
      ],
    });
  }

  return {
    groups,
    user,
    isLoading,
    hasOperatorWorkspace,
  };
}
