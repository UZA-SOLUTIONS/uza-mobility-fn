import { HomeHeroOverlay } from '@/components/marketing/home-hero-overlay';
import { HomeHeroPoster } from '@/components/marketing/home-hero-poster';
import { HomeAvailableSectionSkeleton } from '@/components/marketing/home-available-section-skeleton';
import { HomePerfectFitSkeleton } from '@/components/marketing/home-perfect-fit-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { marketingContainer } from '@/lib/marketing/layout-classes';

/** Matches home hero layout so navigation to / does not flash. */
export default function HomeLoading() {
  return (
    <>
      <section className="relative flex h-[clamp(520px,min(55.5vw,90vh),800px)] w-full items-end overflow-hidden">
        <HomeHeroPoster priority />
        <HomeHeroOverlay />
        <div
          className={`relative z-10 ${marketingContainer} pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20`}
        >
          <div className="max-w-xl space-y-8">
            <div className="space-y-2">
              <Skeleton className="h-12 w-full max-w-md bg-white/20" />
              <Skeleton className="h-6 w-full max-w-lg bg-white/15" />
            </div>
            <Skeleton className="h-12 w-40 rounded-full bg-white/20" />
          </div>
        </div>
      </section>
      <HomeAvailableSectionSkeleton />
      <div className="bg-white py-20">
        <div className={marketingContainer}>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[283px] rounded-lg" />
            <Skeleton className="h-[283px] rounded-lg" />
          </div>
        </div>
      </div>
      <HomePerfectFitSkeleton />
      <section className="relative h-[400px] w-full overflow-hidden bg-[#174438]">
        <div className="absolute inset-0 bg-[#17443866]" aria-hidden />
      </section>
    </>
  );
}
