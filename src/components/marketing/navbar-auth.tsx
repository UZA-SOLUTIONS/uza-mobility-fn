'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { hasBuyerWorkspace, hasMarketplaceWorkspace } from '@/lib/permissions';
import { brand } from '@/lib/marketing/colors';
import { isMeUser } from '@/types/auth/me-user';
import { useLogout } from '@/queries/auth';

type NavbarAuthProps = {
  overlay?: boolean;
};

export function NavbarAuth({ overlay = false }: NavbarAuthProps) {
  const { data: session, status } = useSession();
  const logout = useLogout();

  if (status === 'loading') {
    return <Skeleton className="mx-5 h-4 w-28" />;
  }

  if (isMeUser(session?.user) && hasMarketplaceWorkspace(session.user)) {
    const isBuyer = hasBuyerWorkspace(
      session.user.permissions,
      session.user.roles,
    );
    const notificationsHref = workspaceRoutes.accountNotifications;

    return (
      <div className="flex items-center gap-2 px-3">
        <NotificationBell
          viewAllHref={notificationsHref}
          triggerClassName={
            overlay
              ? 'text-white hover:text-white hover:bg-white/10'
              : 'text-primary hover:text-primary'
          }
          badgeClassName="bg-[#AAFF47] text-[#174438]"
        />
        {isBuyer ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="border-0 hover:opacity-90"
                style={{ backgroundColor: brand.lime, color: brand.forest }}
              >
                My account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href={workspaceRoutes.account}>Purchases overview</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={workspaceRoutes.accountWishlist}>Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={workspaceRoutes.accountOrders}>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={workspaceRoutes.accountBookings}>Bookings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={workspaceRoutes.accountProfile}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            asChild
            className="border-0 hover:opacity-90"
            style={{ backgroundColor: brand.lime, color: brand.forest }}
          >
            <Link href="/vehicles">Continue browsing</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Link
      href={authRoutes.login}
      className="px-5 py-3 text-sm font-medium"
      style={{ color: overlay ? brand.lime : brand.forest }}
    >
      Sign in / Register
    </Link>
  );
}
