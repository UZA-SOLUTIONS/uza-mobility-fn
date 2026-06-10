import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import {
  marketingProseSection,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';

export default function ForBusinessPage() {
  return (
    <>
      <MarketingPageHero
        title="For Business"
        description="Programs for buyers, sellers, and fleet partners."
      />
      <div className={marketingWhiteSurface}>
        <div className={`${marketingProseSection} text-[#356769]`}>
          <p className="text-base leading-relaxed">
            Contact us for fleet quotes, seller onboarding, and financing
            facilitation. Detailed pricing will be published here soon.
          </p>
        </div>
      </div>
    </>
  );
}
