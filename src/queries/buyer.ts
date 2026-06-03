'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api';
import { refreshSession } from '@/lib/auth/session-update';
import {
  createBuyerProfile,
  getBuyerProfile,
  getMyFinancingRequests,
  getMyInvoice,
  getMyInvoices,
  getMyOrders,
  getMyPayments,
  getOrderTracking,
  downloadInvoiceDocument,
  openInvoiceDocument,
  requestInvoice,
  browsePublishedListings,
  submitFinancingRequest,
  submitPayment,
  updateBuyerProfile,
} from '@/lib/api/buyer';
import type { BrowsePublishedListingsFilters } from '@/lib/api/buyer';
import { authKeys } from '@/queries/auth';
import type {
  BuyerInvoicesFilters,
  BuyerOrdersFilters,
  BuyerPaymentsFilters,
} from '@/types/buyer/commerce';
import type {
  CreateBuyerProfileInput,
  FinancingRequestInput,
  RequestInvoiceInput,
  SubmitPaymentInput,
  UpdateBuyerProfileInput,
} from '@/schemas/buyer';

export const buyerKeys = {
  all: ['buyer'] as const,
  profile: () => [...buyerKeys.all, 'profile'] as const,
  orders: (filters: BuyerOrdersFilters) =>
    [...buyerKeys.all, 'orders', filters] as const,
  orderTracking: (id: string) =>
    [...buyerKeys.all, 'order-tracking', id] as const,
  invoices: (filters: BuyerInvoicesFilters) =>
    [...buyerKeys.all, 'invoices', filters] as const,
  invoice: (id: string) => [...buyerKeys.all, 'invoice', id] as const,
  payments: (filters: BuyerPaymentsFilters) =>
    [...buyerKeys.all, 'payments', filters] as const,
  financing: () => [...buyerKeys.all, 'financing'] as const,
  publishedListings: (filters: BrowsePublishedListingsFilters) =>
    [...buyerKeys.all, 'published-listings', filters] as const,
};

function mutationError(error: unknown) {
  return error instanceof ApiClientError
    ? error.message
    : 'Something went wrong. Please try again.';
}

/** Session access token for buyer queries — avoids calling getSession() per request. */
export function useBuyerAccessToken(extraEnabled = true) {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const ready =
    extraEnabled &&
    status === 'authenticated' &&
    Boolean(accessToken) &&
    session?.error !== 'RefreshAccessTokenError';

  return { accessToken, ready, status, session };
}

export function useBuyerProfile(extraEnabled = true) {
  const { accessToken, ready } = useBuyerAccessToken(extraEnabled);
  return useQuery({
    queryKey: buyerKeys.profile(),
    queryFn: () => getBuyerProfile(accessToken),
    enabled: ready,
    retry: false,
  });
}

export function useCreateBuyerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBuyerProfileInput) => createBuyerProfile(body),
    onSuccess: async () => {
      toast.success('Buyer profile created');
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      void queryClient.invalidateQueries({ queryKey: buyerKeys.profile() });
      try {
        await refreshSession();
      } catch {
        // optional
      }
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useUpdateBuyerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateBuyerProfileInput) => updateBuyerProfile(body),
    onSuccess: async () => {
      toast.success('Buyer profile updated');
      void queryClient.invalidateQueries({ queryKey: authKeys.me() });
      void queryClient.invalidateQueries({ queryKey: buyerKeys.profile() });
      try {
        await refreshSession();
      } catch {
        // optional
      }
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useMyOrders(filters: BuyerOrdersFilters = {}) {
  const { accessToken, ready } = useBuyerAccessToken();
  return useQuery({
    queryKey: buyerKeys.orders(filters),
    queryFn: () => getMyOrders(filters, accessToken),
    enabled: ready,
  });
}

export function useOrderTracking(orderId: string | null) {
  const { accessToken, ready } = useBuyerAccessToken(Boolean(orderId));
  return useQuery({
    queryKey: buyerKeys.orderTracking(orderId ?? ''),
    queryFn: () => getOrderTracking(orderId!, accessToken),
    enabled: ready,
  });
}

export function useMyInvoices(
  filters: BuyerInvoicesFilters = {},
  extraEnabled = true,
) {
  const { accessToken, ready } = useBuyerAccessToken(extraEnabled);
  return useQuery({
    queryKey: buyerKeys.invoices(filters),
    queryFn: () => getMyInvoices(filters, accessToken),
    enabled: ready,
  });
}

export function useMyInvoice(id: string | null) {
  const { accessToken, ready } = useBuyerAccessToken(Boolean(id));
  return useQuery({
    queryKey: buyerKeys.invoice(id ?? ''),
    queryFn: () => getMyInvoice(id!, accessToken),
    enabled: ready,
  });
}

export function useRequestInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RequestInvoiceInput) => requestInvoice(body),
    onSuccess: () => {
      toast.success('Invoice requested');
      void queryClient.invalidateQueries({
        queryKey: [...buyerKeys.all, 'invoices'],
      });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useOpenInvoiceDocument() {
  return useMutation({
    mutationFn: (invoiceId: string) => openInvoiceDocument(invoiceId),
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : 'Could not open document',
      ),
  });
}

export function useDownloadInvoiceDocument() {
  return useMutation({
    mutationFn: ({
      invoiceId,
      invoiceNumber,
    }: {
      invoiceId: string;
      invoiceNumber: string;
    }) => downloadInvoiceDocument(invoiceId, invoiceNumber),
    onSuccess: () => toast.success('Invoice downloaded'),
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : 'Could not download invoice',
      ),
  });
}

export function useMyPayments(filters: BuyerPaymentsFilters = {}) {
  const { accessToken, ready } = useBuyerAccessToken();
  return useQuery({
    queryKey: buyerKeys.payments(filters),
    queryFn: () => getMyPayments(filters, accessToken),
    enabled: ready,
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      proofs,
    }: {
      body: SubmitPaymentInput;
      proofs: File[];
    }) => submitPayment(body, proofs),
    onSuccess: () => {
      toast.success('Payment proof submitted');
      void queryClient.invalidateQueries({
        queryKey: [...buyerKeys.all, 'payments'],
      });
      void queryClient.invalidateQueries({
        queryKey: [...buyerKeys.all, 'invoices'],
      });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}

export function useMyFinancing() {
  const { accessToken, ready } = useBuyerAccessToken();
  return useQuery({
    queryKey: buyerKeys.financing(),
    queryFn: () => getMyFinancingRequests(accessToken),
    enabled: ready,
  });
}

export function usePublishedListings(
  filters: BrowsePublishedListingsFilters = {},
  extraEnabled = false,
) {
  const enabled = extraEnabled;
  return useQuery({
    queryKey: buyerKeys.publishedListings(filters),
    queryFn: () => browsePublishedListings(filters),
    enabled,
  });
}

export function useSubmitFinancing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FinancingRequestInput) => submitFinancingRequest(body),
    onSuccess: () => {
      toast.success('Financing request submitted');
      void queryClient.invalidateQueries({ queryKey: buyerKeys.financing() });
    },
    onError: (error) => toast.error(mutationError(error)),
  });
}
