'use client';

import { WorkspaceShell } from '@/components/workspace/workspace-shell';
import { sellerNavGroups } from '@/config/navigation';
import { workspaceRoutes } from '@/config/routes';
import {
  formatSellerChannel,
  marketplaceMeSeller,
} from '@/lib/auth/seller-profiles';
import { useSessionUser } from '@/hooks/session-user';

type SellerShellProps = {
  children: React.ReactNode;
};

export function SellerShell({ children }: SellerShellProps) {
  const { user } = useSessionUser();
  const profile = marketplaceMeSeller(user);

  const sidebarFooter = profile ? (
    <>
      <p className="truncate text-xs font-medium">{profile.businessName}</p>
      <p className="truncate text-xs text-muted-foreground">
        {formatSellerChannel(profile.sellerType)} · {profile.status}
        {profile.isVerified ? ' · Verified' : ''}
      </p>
    </>
  ) : user ? (
    <>
      <p className="truncate text-xs font-medium">{user.email}</p>
      <p className="truncate text-xs text-muted-foreground">Seller</p>
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
