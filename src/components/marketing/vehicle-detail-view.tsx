import Image from 'next/image';
import Link from 'next/link';
import { Battery, Car, Gauge, MapPin, Settings2 } from 'lucide-react';
import { VehicleDetailGallery } from '@/components/marketing/vehicle-detail-gallery';
import { authRoutes } from '@/config/routes';
import { vehiclesHref } from '@/lib/marketing/vehicles-url';
import {
  buildVehicleSpecRows,
  formatHandoverLine,
  formatStockLocation,
  getListingPhotos,
  resolveListingVideoUrl,
} from '@/lib/marketing/listing-detail';
import {
  formatListingPrice,
  listingDetailHref,
} from '@/lib/marketing/listing-display';
import { brand } from '@/lib/marketing/colors';
import type { PublicListing } from '@/types/marketplace/public-listing';

const SPEC_ICONS: Record<string, typeof Car> = {
  Body: Car,
  Mileage: Gauge,
  Battery: Battery,
  Year: Settings2,
  Transmission: Settings2,
  Charging: Battery,
  'Drive Type': Car,
  Condition: Car,
  Seats: Car,
  Color: Car,
};

type VehicleDetailViewProps = {
  listing: PublicListing;
};

export function VehicleDetailView({ listing }: VehicleDetailViewProps) {
  const photos = getListingPhotos(listing);
  const specRows = buildVehicleSpecRows(listing);
  const reserveHref = `${authRoutes.register}?callbackUrl=${encodeURIComponent(listingDetailHref(listing.slug))}`;

  return (
    <>
      <div className="bg-white py-14">
        <div className="mx-auto max-w-[1440px] px-[60px]">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_429px]">
            <div className="space-y-5">
              <VehicleDetailGallery
                photos={photos}
                title={listing.listingTitle}
                videoUrl={resolveListingVideoUrl(listing)}
              />

              {listing.description?.trim() ? (
                <div className="rounded-2xl border border-[#E9E9E9] p-8">
                  <h2 className="mb-4 text-lg font-semibold text-[#151515]">
                    Description
                  </h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#356769]">
                    {listing.description}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E9E9E9] p-8">
                <p
                  className="text-sm font-medium"
                  style={{ color: brand.teal }}
                >
                  The Price
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#151515]">
                  {formatListingPrice(listing)}
                </p>

                <div className="mt-6 space-y-4 text-sm text-[#151515]">
                  <div className="flex gap-2">
                    <MapPin
                      className="mt-0.5 size-[18px] shrink-0"
                      style={{ color: brand.teal }}
                    />
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: brand.teal }}
                      >
                        Location
                      </span>
                      <p>{formatStockLocation(listing)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Car
                      className="mt-0.5 size-[18px] shrink-0"
                      style={{ color: brand.teal }}
                    />
                    <div>
                      <span
                        className="font-medium"
                        style={{ color: brand.teal }}
                      >
                        Delivery
                      </span>
                      <p>{formatHandoverLine(listing)}</p>
                    </div>
                  </div>
                </div>

                <Link
                  href={reserveHref}
                  className="mt-8 flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: brand.forest }}
                >
                  Reserve This Vehicle
                </Link>
              </div>

              <div className="rounded-2xl border border-[#E9E9E9] p-8">
                <ul className="divide-y divide-[#E9E9E9]">
                  {specRows.map((row) => {
                    const Icon = SPEC_ICONS[row.label] ?? Car;
                    return (
                      <li
                        key={row.label}
                        className="grid grid-cols-2 gap-4 py-3 text-sm"
                      >
                        <span className="flex items-center gap-2 text-[#151515]">
                          <Icon className="size-[18px] shrink-0" />
                          {row.label}
                        </span>
                        <span className="text-[#151515]">{row.value}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative min-h-[260px] overflow-hidden rounded-2xl px-6 py-8">
                <div className="absolute inset-0" aria-hidden>
                  <Image
                    src="/images/find-accessories.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 380px"
                  />
                </div>
                <div className="absolute inset-0 bg-[#17443866]" aria-hidden />
                <div className="relative z-10 flex min-h-[196px] items-end">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">
                      Keep It Moving
                    </h2>
                    <Link
                      href="/spare-parts"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold"
                      style={{
                        backgroundColor: brand.lime,
                        color: brand.forest,
                      }}
                    >
                      Find Accessories
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
