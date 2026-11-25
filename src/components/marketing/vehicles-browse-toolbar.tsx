'use client';

import { useAppRouter } from '@/lib/navigation/use-app-router';
import { useCallback, useState, useTransition, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  applyVehiclesSearchPatch,
  VEHICLE_SORT_OPTIONS,
  type VehiclesSearchParams,
} from '@/lib/marketing/vehicles-browse';
import { vehiclesHref } from '@/lib/marketing/vehicles-url';

type VehiclesBrowseToolbarProps = {
  filters: VehiclesSearchParams;
};

export function VehiclesBrowseToolbar({ filters }: VehiclesBrowseToolbarProps) {
  const router = useAppRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.q ?? '');

  const navigate = useCallback(
    (next: VehiclesSearchParams) => {
      startTransition(() => {
        router.push(vehiclesHref(next));
      });
    },
    [router],
  );

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(
      applyVehiclesSearchPatch(filters, { q: query.trim() || undefined }),
    );
  };

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
      <form onSubmit={onSearchSubmit} className="min-w-0 flex-1 space-y-1.5">
        <Label className="text-sm font-medium text-[#151515]" htmlFor="vehicles-q">
          Search
        </Label>
        <label className="relative flex h-11 items-center rounded-lg border border-[#E9E9E9] bg-white pr-3 pl-4">
          <Search className="size-5 shrink-0 text-[#356769]" aria-hidden />
          <input
            id="vehicles-q"
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vehicles…"
            className="ml-2 min-w-0 flex-1 border-0 bg-transparent text-sm text-[#151515] outline-none placeholder:text-[#356769]/80"
          />
        </label>
      </form>

      <div className="flex shrink-0 flex-col gap-1.5 sm:w-52">
        <Label className="text-sm font-medium text-[#151515]">Sort by</Label>
        <Select
          value={filters.sort ?? 'default'}
          onValueChange={(sort) =>
            navigate(
              applyVehiclesSearchPatch(filters, {
                sort: sort === 'default' ? undefined : sort,
              }),
            )
          }
        >
          <SelectTrigger className="h-11 w-full border-[#E9E9E9] bg-white">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            {VEHICLE_SORT_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value || 'default'}
                value={opt.value || 'default'}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
