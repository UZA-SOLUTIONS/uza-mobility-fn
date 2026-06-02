'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { workspaceRoutes } from '@/config/routes';
import { useOperatorNav } from '@/hooks/operator-nav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type OperatorShellProps = {
  children: React.ReactNode;
};

export function OperatorShell({ children }: OperatorShellProps) {
  const { groups, user } = useOperatorNav();

  const sidebarFooter = user ? (
    <>
      <Avatar size="default">
        {user.profilePhoto ? (
          <AvatarImage src={user.profilePhoto} alt={user.email} />
        ) : (
          <AvatarFallback>{user.firstName?.charAt(0) ?? '?'}</AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {user.firstName || user.lastName
            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
            : user.email}
        </p>
        <p className="truncate text-xs text-primary/70">{user.email}</p>
      </div>
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
