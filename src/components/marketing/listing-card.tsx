'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Battery, Gauge } from 'lucide-react';
import { WishlistButton } from '@/components/marketing/wishlist-button';
import {
  formatDrivetrainLabel,
  formatListingPrice,
  getListingPrimaryPhoto,
  listingDetailHref,
  listingSubtitle,
} from '@/lib/marketing/listing-display';
import { brand } from '@/lib/marketing/colors';
import type { PublicListing } from '@/types/marketplace/public-listing';

type ListingCardProps = {
  listing: PublicListing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const pathname = usePathname();
  const imageUrl = getListingPrimaryPhoto(listing);
  const detailHref = listingDetailHref(listing.slug);
  const rangeKm = listing.evSpecs?.rangeKm;
  const batteryKwh = listing.evSpecs?.batteryCapacityKwh;
  const transmission = formatDrivetrainLabel(listing.drivetrain);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E9E9E9] bg-white">
      <div className="relative aspect-[318/212] w-full bg-[#f4f4f4]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={listing.listingTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 318px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#356769]">
            No photo
          </div>
        )}
        <div className="absolute inset-0 p-3 sm:p-4">
          <div className="pointer-events-auto absolute top-3 left-3 sm:top-4 sm:left-4">
            <WishlistButton
              listingId={listing.id}
              iconOnly
              callbackUrl={pathname || detailHref}
            />
          </div>
          {listing.displayBadge ? (
            <span
              className="pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full px-3 py-1.5 text-xs font-semibold sm:bottom-4 sm:left-4"
              style={{ backgroundColor: brand.lime, color: brand.forest }}
            >
              {listing.displayBadge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-[#E9E9E9] p-6">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#151515]">
            {listing.listingTitle}
          </h3>
          <p className="text-sm leading-snug text-[#356769]">
            {listingSubtitle(listing)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-[#E9E9E9] py-4 text-center text-xs text-[#356769]">
          <div className="flex flex-col items-center gap-2">
            <Gauge className="size-[18px]" aria-hidden />
            <span>
              {rangeKm != null ? `${Math.round(rangeKm)} km Range` : '—'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Battery className="size-[18px]" aria-hidden />
            <span>{batteryKwh != null ? `${batteryKwh} kWh` : '—'}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-base leading-none" aria-hidden>
              ⚙
            </span>
            <span>{transmission ?? '—'}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 pt-1">
          <p className="text-lg font-semibold text-[#151515]">
            {formatListingPrice(listing)}
          </p>
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: brand.forest }}
          >
            View Details
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
