import { PublicPartCard } from '@/components/marketing/public-part-card';
import { SparePartsBrowseToolbar } from '@/components/marketing/spare-parts-browse-toolbar';
import { SparePartsCategoryTabs } from '@/components/marketing/spare-parts-category-tabs';
import { getBrowseFilterOptions } from '@/lib/api/marketplace';
import { browsePublicParts } from '@/lib/api/parts';
import {
  buildSparePartsCategoryTabs,
  type SparePartsSearchParams,
} from '@/lib/marketing/spare-parts-browse';
import {
  marketingContainer,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';
import type { BrowseFilterOptions } from '@/lib/marketing/vehicles-browse';
import type { Category } from '@/types/catalog';
import type { PublicPart } from '@/types/marketplace/public-part';

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

  try {
    const [result, options] = await Promise.all([
      browsePublicParts({
        q: filters.q,
        category: filters.category,
        brand: filters.brand,
        model: filters.model,
        page: 1,
        limit: 48,
      }),
      getBrowseFilterOptions({ brand: filters.brand }).catch(
        () => emptyFilterOptions,
      ),
    ]);
    parts = result.items;
    filterOptions = options;
  } catch {
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

        {parts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parts.map((part) => (
              <PublicPartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-[#E9E9E9] px-6 py-16 text-center text-[#356769]">
            No public spare parts match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
