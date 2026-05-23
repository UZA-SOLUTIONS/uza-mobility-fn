import { siteConfig } from '@/config/site';
import type { ApiResponse } from '@/types/api/envelope';
import { ApiClientError } from './error';
import type { ApiRequestOptions } from './types';

export { ApiClientError } from './error';
export type { ApiRequestOptions } from './types';

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, headers, ...init } = options;
  const url = `${siteConfig.apiUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    const message =
      !body.success && 'error' in body
        ? body.error.message
        : response.statusText;
    const code = !body.success && 'error' in body ? body.error.code : undefined;
    throw new ApiClientError(message, response.status, code);
  }

  return body.data;
}
