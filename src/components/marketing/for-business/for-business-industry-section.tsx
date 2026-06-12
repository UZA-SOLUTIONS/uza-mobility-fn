import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  FOR_BUSINESS_INDUSTRY_CARDS,
  forBusinessIndustryHref,
} from '@/lib/marketing/for-business';
import { getListingPrimaryPhoto } from '@/lib/marketing/listing-display';
import { brand } from '@/lib/marketing/colors';
import { marketingContainer } from '@/lib/marketing/layout-classes';
import type { PublicListing } from '@/types/marketplace/public-listing';

type ForBusinessIndustrySectionProps = {
  listingByCategorySlug: Record<string, PublicListing | undefined>;
};

export function ForBusinessIndustrySection({
  listingByCategorySlug,
}: ForBusinessIndustrySectionProps) {
  return (
    <section
      className="py-16 sm:py-20"
      style={{ backgroundColor: brand.forest }}
    >
      <div className={`${marketingContainer} space-y-10`}>
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Built for Your Industry.
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {FOR_BUSINESS_INDUSTRY_CARDS.map((card) => {
            const listing = listingByCategorySlug[card.categorySlug];
            const imageUrl = listing ? getListingPrimaryPhoto(listing) : null;
            const imageSrc = imageUrl ?? '/images/buss-image1.png';
            const href = forBusinessIndustryHref(card);

            return (
              <article
                key={card.title}
                className="flex flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[429/229] w-full bg-white/10">
                  <Image
                    src={imageSrc}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div
                  className="flex flex-1 flex-col gap-6 p-8"
                  style={{ backgroundColor: brand.tealCard }}
                >
                  <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-white">
                      {card.title}
                    </h3>
                    <p className="text-base leading-relaxed text-white/95">
                      {card.description}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ color: brand.lime }}
                  >
                    {card.cta}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
