import type { Category } from '@/types/catalog';

export type SparePartsSearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  model?: string;
};

const SPARE_PARTS_TAB_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /charg/i, label: 'Chargers' },
  { pattern: /batter/i, label: 'Batteries' },
  {
    pattern: /motor|drivetrain|power-electronic/i,
    label: 'Motors & Drivetrain',
  },
  { pattern: /brake|suspension|tire/i, label: 'Suspension & Brakes' },
  { pattern: /cabin|body|exterior/i, label: 'Exterior & Body' },
];

export type SparePartsCategoryTab = {
  slug?: string;
  label: string;
};

export function buildSparePartsCategoryTabs(
  categories: Category[],
): SparePartsCategoryTab[] {
  const partsCategory = categories.find(
    (category) => category.type === 'EV_PARTS_ACCESSORIES',
  );
  const subs = partsCategory?.subcategories ?? [];
  const tabs: SparePartsCategoryTab[] = [{ label: 'All' }];
  const seen = new Set<string>();

  for (const { pattern, label } of SPARE_PARTS_TAB_PATTERNS) {
    const match = subs.find(
      (sub) =>
        sub.isActive &&
        (pattern.test(sub.slug) || pattern.test(sub.name.toLowerCase())),
    );
    if (match && !seen.has(label)) {
      seen.add(label);
      tabs.push({ slug: match.slug, label });
    }
  }

  if (tabs.length === 1) {
    for (const sub of subs.filter((item) => item.isActive)) {
      tabs.push({ slug: sub.slug, label: sub.name });
    }
  }

  return tabs;
}

export function applySparePartsSearchPatch(
  current: SparePartsSearchParams,
  patch: Partial<SparePartsSearchParams>,
): SparePartsSearchParams {
  return { ...current, ...patch };
}
