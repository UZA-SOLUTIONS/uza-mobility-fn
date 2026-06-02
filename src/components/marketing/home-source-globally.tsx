import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';

export function HomeSourceGlobally() {
  return (
    <section className="bg-white pt-4 pb-20">
      <div className="mx-auto max-w-[1440px] px-[60px]">
        <div className="relative h-[550px] overflow-hidden rounded-[32px] px-[60px]">
          <div className="absolute inset-0" aria-hidden>
            <Image
              src="/images/sourcing-img.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#17443866',
            }}
            aria-hidden
          />
          <div className="relative z-10 flex h-full items-end pb-[60px]">
            <div className="space-y-8 pt-8">
              <div className="space-y-4">
                <h2 className="text-[56px] leading-[1.05] font-semibold text-white">
                  Source Globally.
                  <br />
                  Maximize Your Budget.
                </h2>
                <p className="text-base leading-[1.45] text-white">
                  Tell us what you need. We secure factory-direct EVs with 100%
                  transparent, landed pricing straight to Kigali.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex h-12 w-[180px] items-center justify-center rounded-full text-sm font-semibold"
                style={{ backgroundColor: brand.lime, color: brand.forest }}
              >
                Start Sourcing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
