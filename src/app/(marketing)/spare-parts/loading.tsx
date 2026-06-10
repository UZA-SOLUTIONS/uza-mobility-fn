import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import { marketingWhiteSurface } from '@/lib/marketing/layout-classes';

/**
 * Route-specific fallback to avoid flashing the generic marketing loader.
 */
export default function SparePartsLoading() {
  return (
    <>
      <MarketingPageHero
        title="Spare Parts"
        description="Browse public spare parts."
      />
      <div
        className={`min-h-[50vh] ${marketingWhiteSurface}`}
        aria-busy
        aria-label="Loading spare parts"
      />
    </>
  );
}
