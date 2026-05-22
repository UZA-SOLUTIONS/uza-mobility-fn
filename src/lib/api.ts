import { siteConfig } from '@/config/site';
import type { ApiResponse } from '@/types';

type RequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
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
