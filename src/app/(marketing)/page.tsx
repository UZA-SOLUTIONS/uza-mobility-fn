import { Suspense } from 'react';
import { HomeAvailableSectionAsync } from '@/components/marketing/home-available-section-async';
import { HomeAvailableSectionSkeleton } from '@/components/marketing/home-available-section-skeleton';
import { HomeHero } from '@/components/marketing/home-hero';
import { HomePerfectFit } from '@/components/marketing/home-perfect-fit';
import { HomePromoGrid } from '@/components/marketing/home-promo-grid';
import { HomeSourceGlobally } from '@/components/marketing/home-source-globally';

export default function LandingPage() {
  return (
    <>
      <HomeHero />
      <Suspense fallback={<HomeAvailableSectionSkeleton />}>
        <HomeAvailableSectionAsync />
      </Suspense>
      <HomePromoGrid />
      <HomePerfectFit />
      <HomeSourceGlobally />
    </>
  );
}
