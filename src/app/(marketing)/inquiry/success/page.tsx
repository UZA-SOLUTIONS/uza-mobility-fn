import Link from 'next/link';
import { Suspense } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { AuthFormCard } from '@/components/auth/auth-form-card';
import { InquirySuccessActions } from '@/components/marketing/inquiry-success-actions';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { buyerInvoiceRequestHref } from '@/lib/buyer/invoice-flow';
import {
  buildRegisterHref,
  parseRegisterPrefill,
} from '@/lib/auth/register-prefill';
import { brand } from '@/lib/marketing/colors';
import {
  marketingContainer,
  marketingMintSurface,
} from '@/lib/marketing/layout-classes';

type InquirySuccessPageProps = {
  searchParams: Promise<{
    email?: string;
    quote?: string;
    name?: string;
    phone?: string;
    intent?: string;
    listingId?: string;
    slug?: string;
  }>;
};

export default async function InquirySuccessPage({
  searchParams,
}: InquirySuccessPageProps) {
  const params = await searchParams;
  const email = params.email?.trim() ?? '';
  const quote = params.quote?.trim() ?? '';
  const isBuy = params.intent?.toLowerCase() === 'buy';
  const listingId = params.listingId?.trim() ?? '';
  const slug = params.slug?.trim() ?? '';
  const postAuthHref = (() => {
    if (isBuy && listingId && slug) {
      return buyerInvoiceRequestHref({ id: listingId, slug });
    }
    if (!isBuy && slug) {
      return `/vehicles/${slug}`;
    }
    return workspaceRoutes.account;
  })();

  const prefill = parseRegisterPrefill({
    get: (key) => {
      const value = params[key as keyof typeof params];
      return typeof value === 'string' ? value : null;
    },
  });
  const registerHref = buildRegisterHref(prefill, postAuthHref);
  const loginHref = (() => {
    const loginParams = new URLSearchParams();
    if (email) loginParams.set('email', email);
    if (postAuthHref.startsWith('/')) {
      loginParams.set('callbackUrl', postAuthHref);
    }
    const query = loginParams.toString();
    return query ? `${authRoutes.login}?${query}` : authRoutes.login;
  })();

  const benefits = isBuy
    ? [
        'Request your proforma invoice in My invoices',
        'Upload payment proof for finance review',
        'Track purchase status until the vehicle is confirmed',
      ]
    : [
        'Track your booking inquiry',
        'Save vehicles to your wishlist',
        'Submit booking payments faster from your account',
      ];

  return (
    <div
      className={`${marketingMintSurface} flex flex-1 flex-col py-12 sm:py-20`}
    >
      <div className={marketingContainer}>
        <div className="mx-auto max-w-xl space-y-8">
          <div className="space-y-3 text-center">
            <CheckCircle2
              className="mx-auto size-12"
              style={{ color: brand.forest }}
            />
            <h1 className="text-3xl font-semibold text-[#151515]">
              {isBuy ? 'Purchase request received' : 'Booking request received'}
            </h1>
            <p className="text-[#356769]">
              {isBuy
                ? 'Check your email for the vehicle price and payment instructions.'
                : 'Check your email for the vehicle price and booking fee to confirm your reservation.'}
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
                  {isBuy
                    ? 'Create an account to submit payment'
                    : 'Track your booking and get updates'}
                </h2>
                <p className="mt-1 text-sm text-[#356769]">
                  {isBuy
                    ? 'A free buyer account lets you request your invoice, upload payment proof, and follow verification until your purchase is confirmed.'
                    : 'Create a free buyer account to follow this vehicle and complete your booking payment when you are ready.'}
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
                  loginHref={loginHref}
                  returnTo={postAuthHref}
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
              href={loginHref}
              className="font-medium"
              style={{ color: brand.forest }}
            >
              Sign in to continue
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
