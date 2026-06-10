import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import {
  marketingProseSection,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';

export default function BlogPage() {
  return (
    <>
      <MarketingPageHero
        title="Blog"
        description="News and updates from UZA Mobility."
      />
      <div className={marketingWhiteSurface}>
        <div className={`${marketingProseSection} text-[#356769]`}>
          <p className="text-base leading-relaxed">Content coming soon.</p>
        </div>
      </div>
    </>
  );
}
