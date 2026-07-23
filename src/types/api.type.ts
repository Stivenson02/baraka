export interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}
