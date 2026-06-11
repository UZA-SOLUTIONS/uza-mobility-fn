import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import { SparePartsSectionAsync } from '@/components/marketing/spare-parts-section-async';
import { getPublicCategories } from '@/lib/api/catalog';
import type { SparePartsSearchParams } from '@/lib/marketing/spare-parts-browse';
import type { Category } from '@/types/catalog';

type SparePartsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  raw: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = raw[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseSparePartsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): SparePartsSearchParams {
  return {
    q: getParam(raw, 'q')?.trim() || undefined,
    category: getParam(raw, 'category') || undefined,
    brand: getParam(raw, 'brand') || undefined,
    model: getParam(raw, 'model') || undefined,
  };
}

export default async function SparePartsPage({
  searchParams,
}: SparePartsPageProps) {
  const raw = await searchParams;
  const filters = parseSparePartsSearchParams(raw);

  let categories: Category[] = [];
  try {
    categories = await getPublicCategories();
  } catch {
    categories = [];
  }

  return (
    <>
      <MarketingPageHero title="Spare Parts" />
      <SparePartsSectionAsync filters={filters} categories={categories} />
    </>
  );
}
