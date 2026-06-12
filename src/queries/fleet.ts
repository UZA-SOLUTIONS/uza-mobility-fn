'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiClientError } from '@/lib/api';
import { submitFleetRequest, type FleetRequestPayload } from '@/lib/api/fleet';

export function useSubmitFleetRequest() {
  return useMutation({
    mutationFn: (payload: FleetRequestPayload) => submitFleetRequest(payload),
    onError: (error) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : 'Could not submit your request. Please try again.',
      );
    },
  });
}
