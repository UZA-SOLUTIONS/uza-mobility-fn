import { MarketingPageHero } from '@/components/marketing/marketing-page-hero';

export default function BlogPage() {
  return (
    <>
      <MarketingPageHero
        title="Blog"
        description="News and updates from UZA Mobility."
      />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-[60px] py-16 text-[#356769]">
          <p className="text-base leading-relaxed">Content coming soon.</p>
        </div>
      </div>
    </>
  );
}
