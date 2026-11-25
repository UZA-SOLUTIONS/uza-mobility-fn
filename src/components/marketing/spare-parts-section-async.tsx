import { PublicPartCard } from '@/components/marketing/public-part-card';
import { SparePartsBrowseToolbar } from '@/components/marketing/spare-parts-browse-toolbar';
import { SparePartsCategoryTabs } from '@/components/marketing/spare-parts-category-tabs';
import { getBrowseFilterOptions } from '@/lib/api/marketplace';
import { browseAllPublicParts } from '@/lib/api/parts';
import {
  buildSparePartsCategoryTabs,
  type SparePartsSearchParams,
} from '@/lib/marketing/spare-parts-browse';
import { sparePartsHref } from '@/lib/marketing/spare-parts-url';
import {
  marketingContainer,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';
import type { BrowseFilterOptions } from '@/lib/marketing/vehicles-browse';
import type { Category } from '@/types/catalog';
import type { PublicPart } from '@/types/marketplace/public-part';
import Link from 'next/link';

type SparePartsSectionAsyncProps = {
  filters: SparePartsSearchParams;
  categories: Category[];
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

export async function SparePartsSectionAsync({
  filters,
  categories,
}: SparePartsSectionAsyncProps) {
  let parts: PublicPart[] = [];
  let filterOptions = emptyFilterOptions;
  let loadError: string | null = null;

  try {
    const [items, options] = await Promise.all([
      browseAllPublicParts({
        q: filters.q,
        category: filters.category,
        brand: filters.brand,
        model: filters.model,
      }),
      getBrowseFilterOptions({ brand: filters.brand }).catch(
        () => emptyFilterOptions,
      ),
    ]);
    parts = items;
    filterOptions = options;
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : 'Unable to load spare parts right now.';
    parts = [];
  }

  const categoryTabs = buildSparePartsCategoryTabs(categories);

  return (
    <section className={`${marketingWhiteSurface} py-10 sm:py-14 lg:py-[60px]`}>
      <div className={marketingContainer}>
        <SparePartsBrowseToolbar
          filters={filters}
          filterOptions={filterOptions}
        />
        <SparePartsCategoryTabs tabs={categoryTabs} filters={filters} />

        {loadError ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/50 px-6 py-16 text-center">
            <p className="font-medium text-[#151515]">
              Couldn’t load spare parts.
            </p>
            <p className="mt-2 text-sm text-[#356769]">{loadError}</p>
            <Link
              href={sparePartsHref()}
              className="mt-4 inline-block text-sm font-medium text-[#174438] underline-offset-4 hover:underline"
            >
              Try again
            </Link>
          </div>
        ) : parts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parts.map((part) => (
              <PublicPartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E9E9E9] px-6 py-16 text-center">
            <p className="font-medium text-[#151515]">
              No public spare parts match your filters.
            </p>
            <p className="mt-2 text-sm text-[#356769]">
              Try clearing filters or browse all spare parts.
            </p>
            <Link
              href={sparePartsHref()}
              className="mt-4 inline-block text-sm font-medium text-[#174438] underline-offset-4 hover:underline"
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
