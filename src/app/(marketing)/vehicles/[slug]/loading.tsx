import {
  VehicleDetailContentSkeleton,
  VehicleDetailHeroSkeleton,
} from '@/components/marketing/vehicle-detail-skeleton';

export default function VehicleDetailLoading() {
  return (
    <>
      <VehicleDetailHeroSkeleton />
      <VehicleDetailContentSkeleton />
    </>
  );
}
