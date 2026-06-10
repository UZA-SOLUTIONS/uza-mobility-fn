'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { authRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import { cn } from '@/lib/utils';
import { useToggleWishlist, useWishlistIds } from '@/queries/wishlist';

type WishlistButtonProps = {
  listingId: string;
  className?: string;
  /** Compact heart for listing cards */
  iconOnly?: boolean;
  callbackUrl?: string;
};

export function WishlistButton({
  listingId,
  className,
  iconOnly = false,
  callbackUrl,
}: WishlistButtonProps) {
  const { status } = useSession();
  const { data: ids = [] } = useWishlistIds();
  const toggle = useToggleWishlist(listingId);
  const saved = ids.includes(listingId);

  const loginReturn = callbackUrl ?? '/vehicles';

  if (status === 'unauthenticated') {
    if (iconOnly) {
      return (
        <Button
          asChild
          variant="outline"
          size="icon"
          className={cn('size-9 rounded-full bg-white/95 shadow-sm', className)}
          aria-label="Sign in to save to wishlist"
        >
          <Link
            href={`${authRoutes.login}?callbackUrl=${encodeURIComponent(loginReturn)}`}
          >
            <Heart className="size-4" />
          </Link>
        </Button>
      );
    }

    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn('rounded-full', className)}
      >
        <Link
          href={`${authRoutes.login}?callbackUrl=${encodeURIComponent(loginReturn)}`}
        >
          <Heart className="mr-2 size-4" />
          Save
        </Link>
      </Button>
    );
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn('size-9 rounded-full bg-white/95 shadow-sm', className)}
        disabled={toggle.isPending}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        onClick={() => toggle.mutate(saved)}
        style={
          saved ? { borderColor: brand.forest, color: brand.forest } : undefined
        }
      >
        <Heart className={cn('size-4', saved && 'fill-current')} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('rounded-full', className)}
      disabled={toggle.isPending}
      onClick={() => toggle.mutate(saved)}
      style={
        saved ? { borderColor: brand.forest, color: brand.forest } : undefined
      }
    >
      <Heart className={cn('mr-2 size-4', saved && 'fill-current')} />
      {saved ? 'Saved' : 'Save'}
    </Button>
  );
}
