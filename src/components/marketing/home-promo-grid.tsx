import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';

function PromoCard({
  title,
  description,
  cta,
  href,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="flex min-h-[283px] flex-1 overflow-hidden rounded-lg"
      style={{ backgroundColor: brand.tealCard }}
    >
      <div className="flex flex-1 flex-col justify-between p-8">
        <div className="space-y-4">
          <h3 className="text-2xl leading-tight font-semibold text-white md:text-3xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-white/95">{description}</p>
        </div>
        <Link
          href={href}
          className="mt-6 inline-flex h-10 w-fit items-center justify-center rounded-full px-8 text-sm font-semibold"
          style={{ backgroundColor: brand.lime, color: brand.forest }}
        >
          {cta}
        </Link>
      </div>
      <div
        className="hidden w-[200px] shrink-0 bg-gradient-to-br from-white/10 to-black/20 sm:block"
        aria-hidden
      />
    </div>
  );
}

export function HomePromoGrid() {
  return (
    <section className="py-20" style={{ backgroundColor: brand.forest }}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-[60px] md:flex-row">
        <PromoCard
          title="Buy for Your Business"
          description="Electrify your delivery service, taxi association, or corporate fleet with bulk pricing and dedicated support."
          cta="Discover more"
          href="/about"
        />
        <PromoCard
          title="Keep It Moving"
          description="Drive with confidence. We supply verified replacement parts, batteries, and charging stations for every vehicle we sell."
          cta="Find Accessories"
          href="/vehicles"
        />
      </div>
    </section>
  );
}
