import { ForBusinessAdvantageSection } from '@/components/marketing/for-business/for-business-advantage-section';
import { ForBusinessContactSection } from '@/components/marketing/for-business/for-business-contact-section';
import { ForBusinessHero } from '@/components/marketing/for-business/for-business-hero';
import { ForBusinessIndustrySection } from '@/components/marketing/for-business/for-business-industry-section';
import { browseListings } from '@/lib/api/marketplace';
import { getPublicCategories } from '@/lib/api/catalog';
import { FOR_BUSINESS_INDUSTRY_CARDS } from '@/lib/marketing/for-business';
import type { PublicListing } from '@/types/marketplace/public-listing';

async function loadIndustryListingImages() {
  const listingByCategorySlug: Record<string, PublicListing | undefined> = {};

  await Promise.all(
    FOR_BUSINESS_INDUSTRY_CARDS.map(async (card) => {
      if (listingByCategorySlug[card.categorySlug]) return;

      try {
        const result = await browseListings({
          category: card.categorySlug,
          limit: 1,
          page: 1,
        });
        listingByCategorySlug[card.categorySlug] = result.items[0];
      } catch {
        listingByCategorySlug[card.categorySlug] = undefined;
      }
    }),
  );

  return listingByCategorySlug;
}

export default async function ForBusinessPage() {
  const [categories, listingByCategorySlug] = await Promise.all([
    getPublicCategories().catch(() => []),
    loadIndustryListingImages(),
  ]);

  return (
    <>
      <ForBusinessHero />
      <ForBusinessAdvantageSection />
      <ForBusinessIndustrySection
        listingByCategorySlug={listingByCategorySlug}
      />
      <ForBusinessContactSection categories={categories} />
    </>
  );
}
