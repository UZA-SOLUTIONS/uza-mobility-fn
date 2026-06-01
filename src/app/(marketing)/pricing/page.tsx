import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';

export default function PricingPage() {
  return (
    <>
      <MarketingPageHero
        title="For Business"
        description="Programs for buyers, sellers, and fleet partners."
      />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-[60px] py-16 text-[#356769]">
          <p className="text-base leading-relaxed">
            Contact us for fleet quotes, seller onboarding, and financing
            facilitation. Detailed pricing will be published here soon.
          </p>
        </div>
      </div>
    </>
  );
}
