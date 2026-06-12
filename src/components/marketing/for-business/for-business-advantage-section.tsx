import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { brand } from '@/lib/marketing/colors';
import { marketingContainer } from '@/lib/marketing/layout-classes';

const ADVANTAGES = [
  'Drive down costs by eliminating fuel reliance and mechanical downtime.',
  'Power your premises with high-capacity charging hardware built to scale.',
  'Scale with confidence using our bank-ready institutional financing.',
] as const;

export function ForBusinessAdvantageSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div
        className={`${marketingContainer} flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-[50px]`}
      >
        <div className="mx-auto w-full max-w-[715px] shrink-0 lg:mx-0">
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/buss-image1.png"
                  alt="Electric vehicle charging"
                  width={306}
                  height={191}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/buss-image2.png"
                  alt="Commercial electric delivery fleet"
                  width={346}
                  height={294}
                  className="h-full min-h-[180px] w-full object-cover sm:min-h-[240px]"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/buss-image3.png"
                alt="Fleet charging infrastructure"
                width={346}
                height={528}
                className="h-full min-h-[320px] w-full object-cover sm:min-h-[420px] lg:min-h-[528px]"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[555px] space-y-6 lg:flex-1">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#151515] md:text-4xl">
              The Electric Advantage.
            </h2>
            <p
              className="text-base leading-relaxed md:text-xl"
              style={{ color: brand.teal }}
            >
              We orchestrate seamless transitions for commercial fleets,
              logistics providers, and corporate infrastructure.
            </p>
          </div>

          <ul className="space-y-4">
            {ADVANTAGES.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brand.teal }}
                  aria-hidden
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span
                  className="text-base leading-relaxed md:text-xl"
                  style={{ color: brand.teal }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="#fleet-form"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: brand.forest }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
