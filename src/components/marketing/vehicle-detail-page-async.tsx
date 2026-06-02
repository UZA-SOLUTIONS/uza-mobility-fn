import { notFound } from 'next/navigation';
import { VehicleDetailHero } from '@/components/marketing/vehicle-detail-hero';
import { VehicleDetailView } from '@/components/marketing/vehicle-detail-view';
import { getListingBySlug } from '@/lib/api/marketplace';

type VehicleDetailPageAsyncProps = {
  slug: string;
};

export async function VehicleDetailPageAsync({
  slug,
}: VehicleDetailPageAsyncProps) {
  let listing;
  try {
    listing = await getListingBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <VehicleDetailHero listing={listing} />
      <VehicleDetailView listing={listing} />
    </>
  );
}
