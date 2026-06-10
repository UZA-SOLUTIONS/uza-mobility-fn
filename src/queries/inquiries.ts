'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api';
import { getMyInquiries, submitInquiry } from '@/lib/api/inquiries';
import type { InquiryInput } from '@/schemas/inquiry';

export const inquiryKeys = {
  all: ['inquiries'] as const,
  mine: (page: number) => [...inquiryKeys.all, 'mine', page] as const,
};

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (payload: InquiryInput) => submitInquiry(payload),
    onError: (error) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : 'Could not submit inquiry. Please try again.',
      );
    },
  });
}

export function useMyInquiries(page = 1, enabled = true) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  return useQuery({
    queryKey: inquiryKeys.mine(page),
    queryFn: () => getMyInquiries(token!, page),
    enabled: enabled && Boolean(token),
  });
}
