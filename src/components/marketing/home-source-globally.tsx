import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';

export function HomeSourceGlobally() {
  return (
    <section className="bg-white pt-4 pb-20">
      <div className="mx-auto max-w-[1440px] px-[60px]">
        <div
          className="relative overflow-hidden rounded-[32px] px-[60px] py-24"
          style={{
            background: `linear-gradient(135deg, rgba(${brand.forestRgb}, 0.85) 0%, rgba(${brand.forestRgb}, 0.95) 100%)`,
          }}
        >
          <div className="relative z-10 max-w-xl space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl leading-tight font-semibold text-white md:text-4xl">
                Source Globally.
                <br />
                Maximize Your Budget.
              </h2>
              <p className="text-base leading-relaxed text-white/95">
                Tell us what you need. We secure factory-direct EVs with 100%
                transparent, landed pricing straight to Kigali.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold"
              style={{ backgroundColor: brand.lime, color: brand.forest }}
            >
              Start Sourcing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
