/** Max `limit` accepted by public GET /listings and GET /parts. */
export const PUBLIC_API_PAGE_LIMIT = 48;

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};
