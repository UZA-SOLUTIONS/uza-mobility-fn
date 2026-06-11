import { brand } from '@/lib/marketing/colors';
import {
  marketingContainer,
  marketingForestSurface,
} from '@/lib/marketing/layout-classes';
import { cn } from '@/lib/utils';

type MarketingPageHeroProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  centered?: boolean;
};

export function MarketingPageHero({
  title,
  description,
  eyebrow,
  centered = true,
}: MarketingPageHeroProps) {
  return (
    <section
      className={`flex min-h-[280px] w-full items-end md:min-h-[320px] ${marketingForestSurface}`}
    >
      <div className={`${marketingContainer} pt-24 pb-10 sm:pt-28 sm:pb-12`}>
        <div
          className={cn(
            'max-w-3xl space-y-3',
            centered && 'mx-auto text-center',
          )}
        >
          {eyebrow ? (
            <p
              className="text-sm font-medium tracking-wide"
              style={{ color: brand.lime }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-[42px]">
            {title}
          </h1>
          {description ? (
            <p className="text-base text-white/90 md:text-lg">{description}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
