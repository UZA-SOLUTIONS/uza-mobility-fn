import { VehiclesHero } from '@/components/marketing/vehicles-hero';

/** Static hero while listings load — matches the final page header (no skeleton flash). */
export default function VehiclesLoading() {
  return (
    <>
      <VehiclesHero />
      <div
        className="min-h-[50vh] bg-white"
        aria-busy
        aria-label="Loading vehicles"
      />
    </>
  );
}
