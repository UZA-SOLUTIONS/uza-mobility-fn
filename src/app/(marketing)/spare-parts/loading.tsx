import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';

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
        className="min-h-[50vh] bg-white"
        aria-busy
        aria-label="Loading spare parts"
      />
    </>
  );
}
