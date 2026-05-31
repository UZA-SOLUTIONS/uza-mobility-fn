'use client';

import { buyerNavGroups, type NavGroup } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { usePermissions } from '@/hooks/permissions';
import { Store, Zap } from 'lucide-react';

export function useBuyerNav() {
  const {
    hasSellerWorkspace,
    hasOperatorWorkspace,
    hasOperatorApplication,
    user,
    isLoading,
  } = usePermissions();

  const groups: NavGroup[] = buyerNavGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }));

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

  groups.push({
    label: 'Charging',
    items: [
      {
        label: hasOperatorWorkspace
          ? 'Operator workspace'
          : hasOperatorApplication
            ? 'Charging operator application'
            : 'Become a charging operator',
        href: workspaceRoutes.operator,
        icon: Zap,
      },
    ],
  });

  return {
    groups,
    isLoading,
    user,
  };
}
