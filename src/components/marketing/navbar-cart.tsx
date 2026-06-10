'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import { useMyBookings } from '@/queries/bookings';
import { isMeUser } from '@/types/auth/me-user';

type NavbarCartProps = {
  overlay?: boolean;
};

/**
 * Show cart when the buyer has an active booking awaiting payment.
 */
export function NavbarCart({ overlay = false }: NavbarCartProps) {
  const { data: session } = useSession();
  const me = isMeUser(session?.user) ? session.user : null;
  const isBuyer = Boolean(me?.roles.includes('BUYER'));

  const pending = useMyBookings(
    { status: 'AWAITING_PAYMENT', page: 1, limit: 1, activeOnly: true },
    isBuyer,
  );
  const pendingCount = pending.data?.meta.total ?? 0;

  if (!isBuyer || pendingCount <= 0) return null;

  return (
    <Link
      href={workspaceRoutes.accountBookings}
      className={`flex items-center justify-center px-5 py-3 ${
        overlay ? 'text-white' : 'text-primary'
      }`}
      aria-label="Open pending bookings"
    >
      <span className="relative">
        <ShoppingCart className="size-6" />
        <span
          className="absolute -top-2 -right-2 flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-medium"
          style={{ backgroundColor: brand.lime, color: brand.forest }}
        >
          {pendingCount > 99 ? '99+' : pendingCount}
        </span>
      </span>
    </Link>
  );
}
