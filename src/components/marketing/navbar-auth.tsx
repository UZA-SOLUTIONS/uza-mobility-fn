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
import { buyerNavbarAccountLinks } from '@/components/marketing/navbar-account-links';
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
    return <Skeleton className="h-8 w-20 sm:mx-2 sm:w-28" />;
  }

  if (isMeUser(session?.user) && hasMarketplaceWorkspace(session.user)) {
    const isBuyer = hasBuyerWorkspace(
      session.user.permissions,
      session.user.roles,
    );
    const notificationsHref = workspaceRoutes.accountNotifications;

    return (
      <div className="flex items-center gap-1 px-1 sm:gap-2 sm:px-3">
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
                className="h-8 border-0 px-2.5 text-xs hover:opacity-90 sm:h-8 sm:px-3 sm:text-sm"
                style={{ backgroundColor: brand.lime, color: brand.forest }}
              >
                <span className="sm:hidden">Account</span>
                <span className="hidden sm:inline">My account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {buyerNavbarAccountLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
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
      className="px-2 py-2 text-xs font-medium sm:px-5 sm:py-3 sm:text-sm"
      style={{ color: overlay ? brand.lime : brand.forest }}
    >
      <span className="sm:hidden">Sign in</span>
      <span className="hidden sm:inline">Sign in / Register</span>
    </Link>
  );
}
