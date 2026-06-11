'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { buyerNavbarAccountLinks } from '@/components/marketing/navbar-account-links';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { authRoutes } from '@/config/routes';
import { hasBuyerWorkspace, hasMarketplaceWorkspace } from '@/lib/permissions';
import { isMeUser } from '@/types/auth/me-user';
import { useLogout } from '@/queries/auth';

export function NavbarMobileAuth() {
  const { data: session, status } = useSession();
  const logout = useLogout();

  if (status === 'loading') {
    return null;
  }

  if (isMeUser(session?.user) && hasMarketplaceWorkspace(session.user)) {
    const isBuyer = hasBuyerWorkspace(
      session.user.permissions,
      session.user.roles,
    );

    return (
      <div className="mt-4 space-y-1 border-t border-white/15 pt-4">
        <p className="px-2 pb-1 text-xs font-medium tracking-wide text-[#AAFF47]/80 uppercase">
          Your account
        </p>
        {isBuyer ? (
          <>
            {buyerNavbarAccountLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-2 py-2.5 text-sm text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </>
        ) : (
          <SheetClose asChild>
            <Link
              href="/vehicles"
              className="block rounded-lg px-2 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Continue browsing
            </Link>
          </SheetClose>
        )}
        <button
          type="button"
          className="block w-full rounded-lg px-2 py-2.5 text-left text-sm text-white/80 hover:bg-white/10"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 border-t border-white/15 pt-4">
      <SheetClose asChild>
        <Button
          asChild
          className="h-10 w-full rounded-full border-0 bg-[#AAFF47] text-[#174438] hover:bg-[#AAFF47]/90"
        >
          <Link href={authRoutes.login}>Sign in</Link>
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button
          asChild
          variant="outline"
          className="h-10 w-full rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          <Link href={authRoutes.register}>Create account</Link>
        </Button>
      </SheetClose>
    </div>
  );
}
