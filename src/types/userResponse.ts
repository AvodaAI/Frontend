// src/types/userResponse.ts
import { User } from "./user";

export interface UserWithTokens extends User {
    token: string | null;
    refreshToken?: string;
}

export interface UpdateUserDetailsRequest {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    city?: string | null;
    country?: string | null;
}

export interface DeleteUserAccountResponse {
    success: boolean;
    id: number;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    keyword?: string;
    role?: string;
    city?: string;
    country?: string;
}

// Paginated response structure
export interface PaginatedUsersResponse {
    items: User[];
    total: number;
    page: number;
    limit: number;
}
