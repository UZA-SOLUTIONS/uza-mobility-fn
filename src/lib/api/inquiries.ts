import { apiFetch, apiFetchPaginated } from '@/lib/api/api';
import type { InquiryInput } from '@/schemas/inquiry';

export type InquirySubmitResponse = {
  id: string;
  quoteNumber: string;
  email: string;
  listingSlug: string;
  intent: 'BUY' | 'BOOK';
  message: string;
};

export type BuyerInquiry = {
  id: string;
  quoteNumber: string;
  listingId: string | null;
  intent?: 'BUY' | 'BOOK';
  name: string;
  phone: string;
  email: string;
  country: string;
  buyerType: string;
  message: string | null;
  status: string;
  quotePdfUrl: string | null;
  createdAt: string;
  listing?: {
    id: string;
    slug: string;
    listingTitle: string;
    brand: string;
    model: string;
    manufacturingYear: number;
  } | null;
};

export function submitInquiry(payload: InquiryInput) {
  return apiFetch<InquirySubmitResponse>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyInquiries(token: string, page = 1) {
  return apiFetchPaginated<BuyerInquiry>('/inquiries/my', {
    token,
    searchParams: new URLSearchParams({
      page: String(page),
      limit: '20',
    }),
  });
}
