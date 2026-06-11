import { authRoutes } from '@/config/routes';

export type RegisterPrefill = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type SearchParamsLike = {
  get(name: string): string | null;
};

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: '' };
  }

  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1).trim(),
  };
}

export function parseRegisterPrefill(
  searchParams: SearchParamsLike,
): RegisterPrefill {
  const explicitFirstName = searchParams.get('firstName')?.trim() ?? '';
  const explicitLastName = searchParams.get('lastName')?.trim() ?? '';
  const fullName = searchParams.get('name')?.trim() ?? '';

  let firstName = explicitFirstName;
  let lastName = explicitLastName;

  if (!firstName && !lastName && fullName) {
    ({ firstName, lastName } = splitFullName(fullName));
  }

  return {
    email: searchParams.get('email')?.trim() || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    phone: searchParams.get('phone')?.trim() || undefined,
  };
}

export function buildRegisterHref(prefill: RegisterPrefill): string {
  const params = new URLSearchParams();

  if (prefill.email) params.set('email', prefill.email);
  if (prefill.firstName) params.set('firstName', prefill.firstName);
  if (prefill.lastName) params.set('lastName', prefill.lastName);
  if (prefill.phone) params.set('phone', prefill.phone);

  const query = params.toString();
  return query ? `${authRoutes.register}?${query}` : authRoutes.register;
}
