'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { sellerNavGroups } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import { useSessionUser } from '@/hooks/session-user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type SellerShellProps = {
  children: React.ReactNode;
};

export function SellerShell({ children }: SellerShellProps) {
  const { user } = useSessionUser();

  const sidebarFooter = user ? (
    <>
      <Avatar size="default">
        {user.profilePhoto ? (
          <AvatarImage src={user.profilePhoto} alt={user.email} />
        ) : (
          <AvatarFallback>
            {user.firstName?.charAt(0) ?? user.email?.charAt(0) ?? '?'}
          </AvatarFallback>
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
      navGroups={sellerNavGroups}
      rootHref={workspaceRoutes.seller}
      sidebarFooter={sidebarFooter}
    >
      {children}
    </WorkspaceShell>
  );
}
