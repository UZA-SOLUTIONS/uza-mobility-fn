/** API envelope from Nest backend */
export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type UserRole =
  | 'SUPER_ADMIN'
  | 'MARKETPLACE_ADMIN'
  | 'FINANCE_ADMIN'
  | 'SELLER'
  | 'BUYER'
  | string;
