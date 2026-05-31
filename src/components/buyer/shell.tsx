'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { workspaceRoutes } from '@/config/routes';
import { useBuyerNav } from '@/hooks/buyer-nav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type BuyerShellProps = {
  children: React.ReactNode;
};

export function BuyerShell({ children }: BuyerShellProps) {
  const { groups, user } = useBuyerNav();

  const sidebarFooter = user ? (
    <>
      <Avatar size="default">
        {user.profilePhoto ? (
          <AvatarImage src={user.profilePhoto} alt={user.email} />
        ) : (
          <AvatarFallback>
            {user.firstName?.charAt(0) ?? '?'}
            {user.lastName?.charAt(0) ?? ''}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {user.firstName || user.lastName
            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
            : user.email}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
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
