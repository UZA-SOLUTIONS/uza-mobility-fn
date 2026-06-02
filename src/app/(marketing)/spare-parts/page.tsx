import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import { SparePartsSectionAsync } from '@/components/marketing/spare-parts-section-async';

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

export default async function SparePartsPage({
  searchParams,
}: SparePartsPageProps) {
  const raw = await searchParams;
  const q = getParam(raw, 'q')?.trim() || undefined;
  const category = getParam(raw, 'category') || undefined;

  return (
    <>
      <MarketingPageHero
        title="Spare Parts"
        description="Browse public spare parts."
      />
      <SparePartsSectionAsync q={q} category={category} />
    </>
  );
}
