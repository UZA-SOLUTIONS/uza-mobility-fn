import Link from 'next/link';
import { brand } from '@/lib/marketing/colors';

export function HomeHero() {
  return (
    <section className="relative flex h-[clamp(520px,min(55.5vw,90vh),800px)] w-full items-end overflow-hidden">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          className="pointer-events-none absolute top-1/2 left-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.02] object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/images/video_content_mp_.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#17443866',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-[60px] pt-32 pb-20">
        <div className="max-w-xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Electric Mobility, Delivered.
            </h1>
            <p className="max-w-xl text-lg text-white/95">
              Trusted sourcing, verified logistics, and complete energy
              infrastructure.
            </p>
          </div>
          <Link
            href="/vehicles"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: brand.lime, color: brand.forest }}
          >
            Browse Vehicles
          </Link>
        </div>
      </div>
    </section>
  );
}
