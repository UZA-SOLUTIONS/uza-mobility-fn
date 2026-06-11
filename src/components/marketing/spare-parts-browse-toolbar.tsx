'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { VehiclesFilterSelect } from '@/components/marketing/vehicles-filter-select';
import { Button } from '@/components/ui/button';
import { brand } from '@/lib/marketing/colors';
import type { SparePartsSearchParams } from '@/lib/marketing/spare-parts-browse';
import type { BrowseFilterOptions } from '@/lib/marketing/vehicles-browse';
import { sparePartsHref } from '@/lib/marketing/spare-parts-url';
import { useAppRouter } from '@/lib/navigation/use-app-router';

type SparePartsBrowseToolbarProps = {
  filters: SparePartsSearchParams;
  filterOptions: BrowseFilterOptions;
};

export function SparePartsBrowseToolbar({
  filters,
  filterOptions,
}: SparePartsBrowseToolbarProps) {
  const router = useAppRouter();
  const [, startTransition] = useTransition();
  const [brandValue, setBrandValue] = useState(filters.brand);
  const [modelValue, setModelValue] = useState(filters.model);

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(() => {
      router.push(
        sparePartsHref({
          ...filters,
          brand: brandValue,
          model: modelValue,
        }),
      );
    });
  };

  const brandOptions = filterOptions.brands.map((value) => ({
    value,
    label: value,
  }));
  const modelOptions = filterOptions.models.map((value) => ({
    value,
    label: value,
  }));

  return (
    <form
      key={`${filters.brand ?? ''}-${filters.model ?? ''}`}
      onSubmit={onSearchSubmit}
      className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <VehiclesFilterSelect
        label="Make"
        placeholder="Select Make"
        value={brandValue}
        options={brandOptions}
        onChange={(nextBrand) => {
          setBrandValue(nextBrand);
          if (nextBrand !== brandValue) {
            setModelValue(undefined);
          }
        }}
      />
      <VehiclesFilterSelect
        label="Model"
        placeholder="Select Model"
        value={modelValue}
        options={modelOptions}
        onChange={setModelValue}
        disabled={!brandValue}
      />
      <VehiclesFilterSelect
        label="Year"
        placeholder="Select Year"
        value={undefined}
        options={[]}
        onChange={() => undefined}
        disabled
      />
      <div className="flex items-end">
        <Button
          type="submit"
          className="h-11 w-full border-0 text-sm font-semibold hover:opacity-90"
          style={{ backgroundColor: brand.forest, color: '#fff' }}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
