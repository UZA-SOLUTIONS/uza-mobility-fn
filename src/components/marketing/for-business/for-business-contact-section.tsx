import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { FleetRequestForm } from '@/components/marketing/for-business/fleet-request-form';
import { brand } from '@/lib/marketing/colors';
import { marketingContainer } from '@/lib/marketing/layout-classes';
import type { Category } from '@/types/catalog';

type ForBusinessContactSectionProps = {
  categories: Category[];
};

function ContactRow({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-lg px-2.5 py-1.5">
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded text-white"
        style={{ backgroundColor: brand.teal }}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#151515]">{title}</p>
        <p className="text-base" style={{ color: brand.teal }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

export function ForBusinessContactSection({
  categories,
}: ForBusinessContactSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className={`${marketingContainer} relative`}>
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl md:min-h-[680px]">
          <Image
            src="/images/buss-form-image.jpg"
            alt="Fleet consultation"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1320px"
            priority={false}
          />

          <div className="relative flex h-full min-h-[520px] flex-col justify-end gap-8 p-5 sm:p-8 lg:min-h-[680px] lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-10">
            <div className="w-full max-w-[468px] shrink-0">
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/20 backdrop-blur-md">
                <div className="px-6 pt-6 pb-0">
                  <h3 className="text-xl leading-snug font-semibold text-[#fffefc]">
                    Need an immediate fleet <br /> assessment? Speak with our
                    team.
                  </h3>
                </div>
                <div className="mt-5 bg-[#ebfaf0] px-5 py-5">
                  <div className="space-y-1">
                    <ContactRow
                      icon={Phone}
                      title="Call Corporate Sales:"
                      value="+250 788 888 888"
                      href="tel:+250788888888"
                    />
                    <div
                      className="mx-2.5 border-t"
                      style={{ borderColor: brand.forest }}
                    />
                    <ContactRow
                      icon={MapPin}
                      title="Visit us at:"
                      value="Kigali, Rwanda, UNIFY House"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 lg:max-w-[776px]">
              <FleetRequestForm categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
