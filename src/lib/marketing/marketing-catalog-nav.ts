import type { MarketingFooterColumn, NavItem } from '@/config/navigation';
import { vehiclesHref } from '@/lib/marketing/vehicles-url';
import type { Category, CategoryType } from '@/types/admin/marketplace';

const VEHICLE_CATEGORY_TYPES: CategoryType[] = [
  'PASSENGER_EV',
  'TWO_THREE_WHEEL',
];

function activeSubcategories(category: Category) {
  return (category.subcategories ?? []).filter((s) => s.isActive);
}

function subcategoryLinks(categories: Category[]) {
  return categories.flatMap((category) =>
    activeSubcategories(category).map((sub) => ({
      label: sub.name,
      href: vehiclesHref({ subcategory: sub.slug }),
    })),
  );
}

/** Top nav from live category tree (`GET /categories`). */
export function buildMarketingNav(categories: Category[]): NavItem[] {
  return [
    { label: 'Vehicles', href: vehiclesHref() },
    { label: 'Spare Parts', href: '/spare-parts' },
    { label: 'For Business', href: '/for-business' },
    { label: 'About UZA Mobility', href: '/about' },
  ];
}

/** Footer columns from live categories; Support links stay static. */
export function buildMarketingFooterColumns(
  categories: Category[],
): MarketingFooterColumn[] {
  const active = sortPublicCategories(categories);
  const columns: MarketingFooterColumn[] = [];

  const vehicleCategories = active.filter((c) =>
    VEHICLE_CATEGORY_TYPES.includes(c.type),
  );
  const vehicleLinks = subcategoryLinks(vehicleCategories);
  if (vehicleLinks.length > 0) {
    columns.push({ title: 'Vehicles', links: vehicleLinks });
  }

  const commercial = active.find((c) => c.type === 'COMMERCIAL_EV');
  const businessLinks: NavItem[] = [];
  if (commercial) {
    businessLinks.push({
      label: commercial.name,
      href: vehiclesHref({ category: commercial.slug }),
    });
    businessLinks.push(...subcategoryLinks([commercial]));
  }
  businessLinks.push({ label: 'Fleet solutions', href: '/for-business' });
  if (businessLinks.length > 0) {
    columns.push({ title: 'For Business', links: businessLinks });
  }

  const parts = active.find((c) => c.type === 'EV_PARTS_ACCESSORIES');
  if (parts) {
    const partsLinks = subcategoryLinks([parts]);
    if (partsLinks.length > 0) {
      columns.push({ title: 'Spare parts', links: partsLinks });
    }
  }

  columns.push({
    title: 'Support',
    links: [
      { label: 'Contact Us', href: '/about' },
      { label: 'User Manuals', href: '/blog' },
      { label: 'Privacy & Policy', href: '/about' },
    ],
  });

  return columns;
}

/** Homepage “Find Your Perfect Fit” tabs — vehicle categories from the API. */
export type PerfectFitTab = {
  id: string;
  label: string;
  categorySlug: string;
};

/**
 * `GET /categories` already returns only active categories (and active subcategories).
 * Use the list as-is, ordered for display.
 */
export function sortPublicCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function buildPerfectFitTabs(categories: Category[]): PerfectFitTab[] {
  return sortPublicCategories(categories).map((category) => ({
    id: category.slug,
    label: category.name,
    categorySlug: category.slug,
  }));
}
