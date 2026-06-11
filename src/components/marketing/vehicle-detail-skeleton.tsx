import { Skeleton } from '@/components/ui/skeleton';
import {
  marketingContainer,
  marketingForestSurface,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';

export function VehicleDetailHeroSkeleton() {
  return (
    <section
      className={`relative h-[min(650px,85vh)] w-full overflow-hidden ${marketingForestSurface}`}
      aria-hidden
    >
      <Skeleton className="absolute inset-0 bg-white/10" />
      <div className="relative z-10 flex h-full items-end justify-center px-4 pt-24 pb-10 sm:pt-28 sm:pb-16">
        <div className="w-full max-w-3xl space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-3/4 max-w-lg bg-white/20" />
          <Skeleton className="mx-auto h-6 w-1/2 max-w-xs bg-white/15" />
        </div>
      </div>
    </section>
  );
}

export function VehicleDetailContentSkeleton() {
  return (
    <div
      className={`${marketingWhiteSurface} py-8 sm:py-14`}
      aria-busy
      aria-label="Loading vehicle details"
    >
      <div className={marketingContainer}>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_429px]">
          <div className="space-y-5">
            <Skeleton className="aspect-[859/528] w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-[504px] w-full rounded-2xl" />
            <Skeleton className="h-[259px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
