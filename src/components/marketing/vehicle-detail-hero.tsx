import { listingSubtitle } from '@/lib/marketing/listing-display';
import {
  getListingPhotos,
  resolveListingVideoUrl,
} from '@/lib/marketing/listing-detail';
import { resolveMediaUrl } from '@/lib/marketing/listing-display';
import { brand } from '@/lib/marketing/colors';
import type { PublicListing } from '@/types/marketplace/public-listing';

type VehicleDetailHeroProps = {
  listing: PublicListing;
};

export function VehicleDetailHero({ listing }: VehicleDetailHeroProps) {
  const photos = getListingPhotos(listing);
  const primary = photos.find((p) => p.isPrimary) ?? photos[0];
  const imageUrl = resolveMediaUrl(primary?.url ?? null);
  const videoUrl = resolveListingVideoUrl(listing);

  return (
    <section className="relative h-[min(650px,85vh)] w-full overflow-hidden">
      {videoUrl ? (
        <video
          className="pointer-events-none absolute top-1/2 left-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#174438]" />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(${brand.forestRgb}, 0.25) 0%, rgba(${brand.forestRgb}, 0.55) 100%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full items-end justify-center px-[60px] pt-28 pb-16">
        <div className="max-w-3xl space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            {listing.listingTitle}
          </h1>
          <p className="text-lg text-white/95">{listingSubtitle(listing)}</p>
        </div>
      </div>
    </section>
  );
}
