import { VehiclesHero } from '@/components/marketing/vehicles-hero';
import { marketingWhiteSurface } from '@/lib/marketing/layout-classes';

/** Static hero while listings load — matches the final page header (no skeleton flash). */
export default function VehiclesLoading() {
  return (
    <>
      <VehiclesHero />
      <div
        className={`min-h-[50vh] ${marketingWhiteSurface}`}
        aria-busy
        aria-label="Loading vehicles"
      />
    </>
  );
}
