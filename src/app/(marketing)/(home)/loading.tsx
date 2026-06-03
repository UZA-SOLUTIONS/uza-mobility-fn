import { HomeHeroOverlay } from '@/components/marketing/home-hero-overlay';
import { HomeHeroPoster } from '@/components/marketing/home-hero-poster';
import { HomeAvailableSectionSkeleton } from '@/components/marketing/home-available-section-skeleton';
import { HomePerfectFitSkeleton } from '@/components/marketing/home-perfect-fit-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

/** Matches home hero layout so navigation to / does not flash. */
export default function HomeLoading() {
  return (
    <>
      <section className="relative flex h-[clamp(520px,min(55.5vw,90vh),800px)] w-full items-end overflow-hidden">
        <HomeHeroPoster priority />
        <HomeHeroOverlay />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[60px] pt-32 pb-20">
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
        <div className="mx-auto max-w-[1440px] px-[60px]">
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
