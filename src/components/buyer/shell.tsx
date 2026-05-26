'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { workspaceRoutes } from '@/config/routes';
import { useBuyerNav } from '@/hooks/buyer-nav';

type BuyerShellProps = {
  children: React.ReactNode;
};

export function BuyerShell({ children }: BuyerShellProps) {
  const { groups, user } = useBuyerNav();

  const sidebarFooter = user ? (
    <>
      <p className="truncate text-xs font-medium">
        {user.firstName} {user.lastName}
      </p>
      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
    </>
  ) : null;

  return (
    <WorkspaceShell
      navGroups={groups}
      rootHref={workspaceRoutes.account}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </WorkspaceShell>
  );
}
