import { ListingCard } from '@/components/marketing/listing-card';
import { VehiclesBrowseToolbar } from '@/components/marketing/vehicles-browse-toolbar';
import { VehiclesFiltersSidebar } from '@/components/marketing/vehicles-filters-sidebar';
import { VehiclesHero } from '@/components/marketing/vehicles-hero';
import {
  browseAllListings,
  getBrowseFilterOptions,
} from '@/lib/api/marketplace';
import {
  parseVehiclesSearchParams,
  type BrowseFilterOptions,
} from '@/lib/marketing/vehicles-browse';
import { vehiclesHref } from '@/lib/marketing/vehicles-url';
import {
  marketingContainer,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';
import type { PublicListing } from '@/types/marketplace/public-listing';
import Link from 'next/link';

type VehiclesPageAsyncProps = {
  rawSearchParams: Record<string, string | string[] | undefined>;
};

const emptyFilterOptions: BrowseFilterOptions = {
  brands: [],
  models: [],
  conditions: [],
  drivetrains: [],
  colors: [],
  cities: [],
  countries: [],
  batteryCapacitiesKwh: [],
  yearRange: null,
  mileageRange: null,
  priceRange: null,
};

const browseFilterFields = (
  filters: ReturnType<typeof parseVehiclesSearchParams>,
) => ({
  q: filters.q,
  category: filters.category,
  useCase: filters.useCase,
  sort: filters.sort,
  brand: filters.brand,
  model: filters.model,
  condition: filters.condition,
  drivetrain: filters.drivetrain,
  color: filters.color,
  city: filters.city,
  country: filters.country,
  batteryCapacityKwh: filters.batteryCapacityKwh,
  yearMin: filters.yearMin,
  yearMax: filters.yearMax,
  mileageMin: filters.mileageMin,
  mileageMax: filters.mileageMax,
  priceMin: filters.priceMin,
  priceMax: filters.priceMax,
});

export async function VehiclesPageAsync({
  rawSearchParams,
}: VehiclesPageAsyncProps) {
  const filters = parseVehiclesSearchParams(rawSearchParams);
  const isLocalStock = filters.stock === 'local';

  let listings: PublicListing[] = [];
  let filterOptions = emptyFilterOptions;
  let loadError: string | null = null;

  try {
    if (isLocalStock) {
      listings = await browseAllListings({
        sellerType: 'UZA_RWANDA_STOCK',
        ...browseFilterFields(filters),
      });
    } else {
      const [items, options] = await Promise.all([
        browseAllListings(browseFilterFields(filters)),
        getBrowseFilterOptions({
          category: filters.category,
          brand: filters.brand,
        }),
      ]);
      listings = items;
      filterOptions = options;
    }
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : 'Unable to load vehicles right now.';
    listings = [];
  }

  const heroTitle = isLocalStock ? 'Available Now.' : 'Vehicles.';
  const clearFiltersHref = vehiclesHref(
    isLocalStock ? { stock: 'local' } : undefined,
  );

  return (
    <>
      <VehiclesHero title={heroTitle} />
      <div className={marketingWhiteSurface}>
        <div className={`${marketingContainer} py-10 sm:py-14 lg:py-[60px]`}>
          {!isLocalStock ? (
            <VehiclesBrowseToolbar filters={filters} />
          ) : null}

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            {!isLocalStock ? (
              <VehiclesFiltersSidebar
                filters={filters}
                filterOptions={filterOptions}
              />
            ) : null}

            <div className="min-w-0 flex-1">
              {loadError ? (
                <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-6 py-16 text-center">
                  <p className="font-medium text-[#151515]">
                    Couldn’t load vehicles.
                  </p>
                  <p className="mt-2 text-sm text-[#356769]">{loadError}</p>
                  <Link
                    href={clearFiltersHref}
                    className="mt-4 inline-block text-sm font-medium text-[#174438] underline-offset-4 hover:underline"
                  >
                    Try again
                  </Link>
                </div>
              ) : listings.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E9E9E9] px-6 py-16 text-center">
                  <p className="font-medium text-[#151515]">
                    No vehicles match your filters.
                  </p>
                  <p className="mt-2 text-sm text-[#356769]">
                    Try clearing filters or browse the full catalog.
                  </p>
                  <Link
                    href={clearFiltersHref}
                    className="mt-4 inline-block text-sm font-medium text-[#174438] underline-offset-4 hover:underline"
                  >
                    Clear filters
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
