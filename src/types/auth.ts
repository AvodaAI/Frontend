// src/types/auth.ts
import type { User } from "./user";

export interface LoginUserRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UpdatePasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface OAuth2Request {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}
