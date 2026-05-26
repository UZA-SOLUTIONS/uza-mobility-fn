'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { adminRoutes } from '@/config/routes';
import { useAdminNav } from '@/hooks/admin-nav';
import { usePermissions } from '@/hooks/permissions';

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { groups, isLoading: navLoading } = useAdminNav();
  const { user } = usePermissions();

  const sidebarFooter = user ? (
    <>
      <p className="truncate text-xs font-medium">{user.email}</p>
      <p className="truncate text-xs text-muted-foreground">
        {user.roles.join(', ')}
      </p>
    </>
  ) : null;

  return (
    <WorkspaceShell
      navGroups={groups}
      rootHref={adminRoutes.root}
      navLoading={navLoading}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </WorkspaceShell>
  );
}
