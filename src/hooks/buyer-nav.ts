'use client';

import { buyerNavGroups, type NavGroup } from '@/config/navigation';
import { usePermissions } from '@/hooks/permissions';

export function useBuyerNav() {
  const { user, isLoading } = usePermissions();

  const groups: NavGroup[] = buyerNavGroups.map((group) => ({
    ...group,
    items: [...group.items],
  }));

  return {
    groups,
    isLoading,
    user,
  };
}
