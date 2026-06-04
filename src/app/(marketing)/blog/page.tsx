import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';
import { marketingProseSection } from '@/lib/marketing/layout-classes';

export default function BlogPage() {
  return (
    <>
      <MarketingPageHero
        title="Blog"
        description="News and updates from UZA Mobility."
      />
      <div className="bg-white">
        <div className={`${marketingProseSection} text-[#356769]`}>
          <p className="text-base leading-relaxed">Content coming soon.</p>
        </div>
      </div>
    </>
  );
}
