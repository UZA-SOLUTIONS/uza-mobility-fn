'use client';

import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';
import {
  applySparePartsSearchPatch,
  type SparePartsCategoryTab,
  type SparePartsSearchParams,
} from '@/lib/marketing/spare-parts-browse';
import { sparePartsHref } from '@/lib/marketing/spare-parts-url';
import { cn } from '@/lib/utils';

type SparePartsCategoryTabsProps = {
  tabs: SparePartsCategoryTab[];
  filters: SparePartsSearchParams;
};

export function SparePartsCategoryTabs({
  tabs,
  filters,
}: SparePartsCategoryTabsProps) {
  const activeCategory = filters.category;
  return (
    <div className="mb-3 flex flex-wrap gap-6 sm:gap-8">
      {tabs.map((tab) => {
        const active =
          (activeCategory ?? undefined) === (tab.slug ?? undefined);

        return (
          <Link
            key={tab.label}
            href={sparePartsHref(
              applySparePartsSearchPatch(filters, {
                category: tab.slug,
              }),
            )}
            className={cn(
              'pb-3 text-sm transition-colors',
              active ? 'font-medium' : 'text-[#356769] hover:text-[#174438]',
            )}
            style={active ? { color: brand.forest } : undefined}
            aria-current={active ? 'page' : undefined}
          >
            <span className="block">{tab.label}</span>
            {active ? (
              <span
                className="mt-3 block h-0.5 w-full rounded-full"
                style={{ backgroundColor: brand.forest }}
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
