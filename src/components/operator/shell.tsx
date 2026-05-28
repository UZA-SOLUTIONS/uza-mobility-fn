'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { workspaceRoutes } from '@/config/routes';
import { useOperatorNav } from '@/hooks/operator-nav';

type OperatorShellProps = {
  children: React.ReactNode;
};

export function OperatorShell({ children }: OperatorShellProps) {
  const { groups, user } = useOperatorNav();

  const sidebarFooter = user ? (
    <>
      <p className="truncate text-xs font-medium">{user.email}</p>
      <p className="truncate text-xs text-muted-foreground">
        Charging operator workspace
      </p>
    </>
  ) : null;

  return (
    <WorkspaceShell
      navGroups={groups}
      rootHref={workspaceRoutes.operator}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </WorkspaceShell>
  );
}
