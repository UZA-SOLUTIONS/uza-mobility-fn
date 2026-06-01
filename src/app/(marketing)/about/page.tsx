import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import { siteConfig } from '@/config/site';

export default function AboutPage() {
  return (
    <>
      <MarketingPageHero
        title={`About ${siteConfig.name}`}
        description="Electric mobility marketplace built for Rwanda and the region."
      />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-[60px] py-16 text-[#356769]">
          <p className="text-base leading-relaxed">
            We connect buyers with verified electric vehicles, transparent
            landed pricing, and local support in Kigali and beyond.
          </p>
        </div>
      </div>
    </>
  );
}
