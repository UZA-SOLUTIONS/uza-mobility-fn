import { apiFetch } from '@/lib/api/api';

export type FleetRequestSubmitResponse = {
  id: string;
  referenceNumber: string;
  email: string;
  organizationName: string;
  quantity: number;
};

export type FleetRequestPayload = {
  organizationName: string;
  contactPerson: string;
  phone: string;
  email: string;
  buyerType?: 'BUSINESS';
  vehicleCategoryId: string;
  quantity: number;
  notes?: string;
};

export function submitFleetRequest(payload: FleetRequestPayload) {
  return apiFetch<FleetRequestSubmitResponse>('/fleet/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
