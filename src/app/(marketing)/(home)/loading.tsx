import { HomeAvailableSectionSkeleton } from '@/components/marketing/home-available-section-skeleton';
import { HomePerfectFitSkeleton } from '@/components/marketing/home-perfect-fit-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <>
      <Skeleton className="h-[min(800px,90vh)] w-full rounded-none" />
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
      <Skeleton className="h-[400px] w-full rounded-none" />
    </>
  );
}
