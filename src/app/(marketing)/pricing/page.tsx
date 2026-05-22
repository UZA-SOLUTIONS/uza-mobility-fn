import { PageHeader } from '@/components/shared/page-header';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <PageHeader
        title="Pricing"
        description="Programs for buyers, sellers, and fleet partners — details coming soon."
      />
      <p className="text-sm text-muted-foreground">
        Contact us for fleet quotes, seller onboarding, and financing
        facilitation.
      </p>
    </div>
  );
}
