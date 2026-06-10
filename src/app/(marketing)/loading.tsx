import { marketingWhiteSurface } from '@/lib/marketing/layout-classes';

/** Generic fallback — avoid flashing the homepage skeleton on other routes. */
export default function MarketingLoading() {
  return (
    <div
      className={`min-h-[40vh] ${marketingWhiteSurface}`}
      aria-busy
      aria-label="Loading page"
    />
  );
}
