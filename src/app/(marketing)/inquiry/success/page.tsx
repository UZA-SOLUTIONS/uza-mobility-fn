import Link from 'next/link';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { InquirySuccessActions } from '@/components/marketing/inquiry-success-actions';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import {
  marketingContainer,
  marketingMintSurface,
} from '@/lib/marketing/layout-classes';

type InquirySuccessPageProps = {
  searchParams: Promise<{ email?: string; quote?: string }>;
};

export default async function InquirySuccessPage({
  searchParams,
}: InquirySuccessPageProps) {
  const params = await searchParams;
  const email = params.email?.trim() ?? '';
  const quote = params.quote?.trim() ?? '';
  const registerHref = email
    ? `${authRoutes.register}?email=${encodeURIComponent(email)}`
    : authRoutes.register;

  const benefits = [
    'Track your inquiry status',
    'Save vehicles to your wishlist',
    'Book vehicles faster when you are ready to buy',
  ];

  return (
    <div className={`${marketingMintSurface} py-12 sm:py-20`}>
      <div className={marketingContainer}>
        <div className="mx-auto max-w-xl space-y-8">
          <div className="space-y-3 text-center">
            <CheckCircle2
              className="mx-auto size-12"
              style={{ color: brand.forest }}
            />
            <h1 className="text-3xl font-semibold text-[#151515]">
              Inquiry received
            </h1>
            <p className="text-[#356769]">
              Your inquiry has been received. Check your email for your quote.
              {quote ? (
                <>
                  {' '}
                  Reference: <strong>{quote}</strong>
                </>
              ) : null}
            </p>
          </div>

          <AuthFormCard>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-[#151515]">
                  Track your inquiry and get updates
                </h2>
                <p className="mt-1 text-sm text-[#356769]">
                  Create a free buyer account to follow this vehicle and move
                  faster when you are ready to purchase.
                </p>
              </div>

              <ul className="space-y-2 text-sm text-[#356769]">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span style={{ color: brand.forest }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Suspense
                fallback={
                  <div className="flex justify-center py-4">
                    <Spinner className="size-5" />
                  </div>
                }
              >
                <InquirySuccessActions
                  email={email}
                  registerHref={registerHref}
                />
              </Suspense>

              <p className="text-center text-sm">
                <Link
                  href="/vehicles"
                  className="text-[#356769] underline-offset-4 hover:underline"
                >
                  No thanks, I will wait for a reply
                </Link>
              </p>
            </div>
          </AuthFormCard>

          <p className="text-center text-xs text-[#356769]">
            Already have an account?{' '}
            <Link
              href={workspaceRoutes.account}
              className="font-medium"
              style={{ color: brand.forest }}
            >
              Go to My account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
