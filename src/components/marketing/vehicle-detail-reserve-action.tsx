'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authRoutes, workspaceRoutes } from '@/config/routes';
import { brand } from '@/lib/marketing/colors';
import {
  buyerInvoiceRequestHref,
  invoiceStatusHint,
  isPayableInvoiceStatus,
} from '@/lib/buyer/invoice-flow';
import { useAppRouter } from '@/lib/navigation/use-app-router';
import {
  useBuyerProfile,
  useMyInvoices,
  useRequestInvoice,
} from '@/queries/buyer';
import { isMeUser } from '@/types/auth/me-user';
import type { PublicListing } from '@/types/marketplace/public-listing';

type VehicleDetailReserveActionProps = {
  listing: PublicListing;
};

export function VehicleDetailReserveAction({
  listing,
}: VehicleDetailReserveActionProps) {
  const router = useAppRouter();
  const { data: session, status } = useSession();
  const me = isMeUser(session?.user) ? session.user : null;
  const isBuyer = Boolean(me?.roles.includes('BUYER'));
  const request = useRequestInvoice();

  const invoiceRequestHref = buyerInvoiceRequestHref({
    id: listing.id,
    slug: listing.slug,
  });
  const loginHref = `${authRoutes.login}?callbackUrl=${encodeURIComponent(invoiceRequestHref)}`;
  const profileHref = `${workspaceRoutes.accountProfile}?returnTo=${encodeURIComponent(invoiceRequestHref)}`;

  const { data: listingInvoices, isLoading: invoicesLoading } = useMyInvoices(
    { listingId: listing.id, pendingPurchase: true, limit: 5 },
    isBuyer,
  );
  const activeInvoice = listingInvoices?.items[0] ?? null;

  const { data: buyerProfile, isLoading: profileLoading } =
    useBuyerProfile(isBuyer);

  const hasBuyerProfile = Boolean(me?.buyerProfile ?? buyerProfile);

  if (status === 'loading' || (isBuyer && invoicesLoading)) {
    return (
      <div className="mt-8 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (activeInvoice) {
    const hint = invoiceStatusHint(activeInvoice.status);
    return (
      <div className="mt-8 space-y-3">
        <div className="rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm">
          <p className="font-medium text-[#151515]">
            Invoice {activeInvoice.invoiceNumber}
          </p>
          <p className="mt-1 text-[#356769] capitalize">
            {activeInvoice.status.replaceAll('_', ' ').toLowerCase()}
          </p>
          {hint ? <p className="mt-2 text-[#356769]">{hint}</p> : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            className="h-10 flex-1 rounded-full"
            style={{ backgroundColor: brand.forest }}
          >
            <Link href={workspaceRoutes.accountInvoices}>View invoice</Link>
          </Button>
          {isPayableInvoiceStatus(activeInvoice.status) ? (
            <Button
              asChild
              variant="outline"
              className="h-10 flex-1 rounded-full"
            >
              <Link
                href={`${workspaceRoutes.accountPayments}?invoiceId=${activeInvoice.id}`}
              >
                Submit payment
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="mt-8 space-y-2">
        <Link
          href={loginHref}
          className="flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: brand.forest }}
        >
          Reserve This Vehicle
        </Link>
        <p className="text-center text-xs text-[#356769]">
          Sign in to request a proforma invoice and reserve this vehicle.
        </p>
      </div>
    );
  }

  if (!isBuyer) {
    return (
      <div className="mt-8 space-y-2">
        <Button asChild className="h-10 w-full rounded-full">
          <Link href={workspaceRoutes.account}>Open workspace</Link>
        </Button>
        <p className="text-center text-xs text-[#356769]">
          Use a buyer account to reserve vehicles on UZA Mobility.
        </p>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="mt-8 flex h-10 w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  if (!hasBuyerProfile) {
    return (
      <div className="mt-8 space-y-2">
        <Button
          asChild
          className="h-10 w-full rounded-full"
          style={{ backgroundColor: brand.forest }}
        >
          <Link href={profileHref}>Complete buyer profile</Link>
        </Button>
        <p className="text-center text-xs text-[#356769]">
          Complete your buyer profile before requesting an invoice.
        </p>
      </div>
    );
  }

  const handleRequestInvoice = () => {
    request.mutate(
      {
        listingId: listing.id,
        buyerAddress:
          buyerProfile?.address ?? me?.buyerProfile?.address ?? undefined,
      },
      {
        onSuccess: (invoice) => {
          toast.success('Invoice requested — vehicle reserved');
          router.push(
            `${workspaceRoutes.accountInvoices}?highlight=${invoice.id}`,
          );
        },
      },
    );
  };

  return (
    <div className="mt-8 space-y-2">
      <Button
        type="button"
        disabled={request.isPending}
        onClick={handleRequestInvoice}
        className="h-10 w-full rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: brand.forest }}
      >
        {request.isPending ? 'Requesting invoice…' : 'Reserve This Vehicle'}
      </Button>
      <p className="text-center text-xs text-[#356769]">
        Requests a proforma invoice and reserves this vehicle for 7 days.
      </p>
    </div>
  );
}
