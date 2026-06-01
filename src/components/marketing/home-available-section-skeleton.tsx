import { Skeleton } from '@/components/ui/skeleton';
import { ListingGridSkeleton } from '@/components/marketing/listing-grid-skeleton';

export function HomeAvailableSectionSkeleton() {
  return (
    <section
      className="bg-white py-20"
      aria-busy
      aria-label="Loading Kigali stock"
    >
      <div className="mx-auto max-w-[1440px] px-[60px]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-80 max-w-full" />
            <Skeleton className="h-5 w-full max-w-2xl" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <ListingGridSkeleton count={4} />
      </div>
    </section>
  );
}
