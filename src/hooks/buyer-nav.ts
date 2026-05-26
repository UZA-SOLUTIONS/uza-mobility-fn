'use client';

import { buyerNavGroups, type NavGroup } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';

export function useBuyerNav() {
  const { hasSellerWorkspace, user, isLoading } = usePermissions();

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

  return {
    groups,
    isLoading,
    user,
  };
}
