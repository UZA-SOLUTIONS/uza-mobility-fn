import Image from 'next/image';
import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';
import {
  marketingContainer,
  marketingWhiteSurface,
} from '@/lib/marketing/layout-classes';

export function HomeSourceGlobally() {
  return (
    <section className={`${marketingWhiteSurface} pt-4 pb-12 sm:pb-20`}>
      <div className={marketingContainer}>
        <div className="relative min-h-[360px] overflow-hidden rounded-2xl px-4 py-8 sm:min-h-[440px] sm:rounded-3xl sm:px-6 sm:py-10 md:min-h-[500px] lg:min-h-[550px] lg:rounded-[32px] lg:px-10 lg:py-0">
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
          <div className="relative z-10 flex h-full min-h-[inherit] items-end pb-6 sm:pb-10 lg:pb-[60px]">
            <div className="space-y-6 pt-4 sm:space-y-8 sm:pt-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl leading-[1.05] font-semibold text-white sm:text-4xl md:text-5xl lg:text-[56px]">
                  Customize your dream
                  <br />
                  Vehicle.
                </h2>
                <p className="line-clamp-3 text-base text-white md:text-xl">
                  Tell us what you need. We secure factory-direct EVs with 100%
                  <br />
                  transparent, landed pricing straight to desired destination.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex h-12 w-[180px] items-center justify-center rounded-full text-sm font-semibold"
                style={{ backgroundColor: brand.lime, color: brand.forest }}
              >
                Customize now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
