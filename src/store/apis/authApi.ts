// src/store/apis/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { enhancedBaseQuery } from "./baseApi";
import type { User, AuthUser, SessionUser } from "@/types";
import type { ApiResponse } from "@/types/api";
import type { LoginUserRequest, UpdatePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest } from "@/types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Register a new user
    registerUser: builder.mutation<ApiResponse<User>, AuthUser>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Login a user
    loginUser: builder.mutation<ApiResponse<{ user: User; token: string }>,LoginUserRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get User Session
    getSession: builder.query<ApiResponse<{ user: User; token: string }>, SessionUser>({
      query: () => "/session",
      providesTags: ["Auth"],
    }),

    // Logout a user
    logoutUser: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Update user password
    updatePassword: builder.mutation<ApiResponse<User>, UpdatePasswordRequest>({
      query: ({ id, oldPassword, newPassword }) => ({
        url: `/users/${id}/password`,
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
      invalidatesTags: ["Auth"],
    }),

    // Forgot password
    forgotPassword: builder.mutation<ApiResponse<void>, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Reset password
    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordRequest>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;