// src/types/api.ts
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
