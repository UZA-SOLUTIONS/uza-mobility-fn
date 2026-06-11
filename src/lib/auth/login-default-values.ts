import type { LoginInput } from '@/schemas/auth';

type SearchParamsLike = {
  get(name: string): string | null;
};

export function getLoginDefaultValues(
  searchParams: SearchParamsLike,
): LoginInput {
  return {
    email: searchParams.get('email')?.trim() ?? '',
    password: '',
  };
}
