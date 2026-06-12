import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';
import { HERO_OVERLAY_COLOR } from '@/components/marketing/home-hero-overlay';
import { marketingContainer } from '@/lib/marketing/layout-classes';

export function ForBusinessHero() {
  return (
    <section className="relative flex min-h-[520px] w-full items-end overflow-hidden md:min-h-[650px]">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/images/buss-top-Hero-section.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(23,68,56,0) 29%, rgba(23,68,56,0.5) 92%), ${HERO_OVERLAY_COLOR}`,
          }}
        />
      </div>
      <div
        className={`relative z-10 ${marketingContainer} pt-28 pb-16 sm:pt-32 sm:pb-20 md:pb-24`}
      >
        <div className="max-w-[710px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[52px] lg:leading-[1.05]">
              Electrify Your Operations.
            </h1>
            <p className="max-w-[668px] text-base leading-relaxed text-white md:text-lg">
              Reduce operating costs and eliminate fuel reliance. We facilitate
              bulk vehicle sourcing, institutional financing, and complete
              charging infrastructure for your enterprise.
            </p>
          </div>
          <Link
            href="#fleet-form"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: brand.lime, color: brand.forest }}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
