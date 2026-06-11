import { Skeleton } from '@/components/ui/skeleton';
import { ListingGridSkeleton } from '@/components/marketing/listing-grid-skeleton';
import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import {
  marketingContainer,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';

export function SparePartsPageSkeleton() {
  return (
    <>
      <MarketingPageHero title="Spare Parts" />
      <div
        className={`${marketingWhiteSurface} py-10 sm:py-14 lg:py-[60px]`}
        aria-busy
        aria-label="Loading spare parts"
      >
        <div className={marketingContainer}>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
          <div className="mb-10 flex flex-wrap gap-6 border-b border-[#E9E9E9] pb-3 sm:gap-8">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-5 w-24" />
            ))}
          </div>
          <ListingGridSkeleton
            count={8}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
        </div>
      </div>
    </>
  );
}
