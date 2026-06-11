import { parseRegisterPrefill } from '@/lib/auth/register-prefill';
import type { RegisterInput } from '@/schemas/auth';

type SearchParamsLike = {
  get(name: string): string | null;
};

export function getRegisterDefaultValues(
  searchParams: SearchParamsLike,
): RegisterInput {
  const prefill = parseRegisterPrefill(searchParams);

  return {
    email: prefill.email ?? '',
    firstName: prefill.firstName ?? '',
    lastName: prefill.lastName ?? '',
    phone: prefill.phone ?? '',
    password: '',
    preferredLanguage: 'en',
  };
}
