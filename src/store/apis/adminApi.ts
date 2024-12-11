// src/store/apis/adminApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { enhancedBaseQuery } from "./baseApi";
import type { ApiError } from "@/types/api";
import type { User, AuthUser } from "@/types";
import type { ActivityLog } from '@/types/activityLog'; 
import type { PaginatedUsersResponse, GetUsersParams,  } from "@/types/userResponse";


export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["User", "ActivityLog"],
  endpoints: (builder) => ({
    // getAllUsers accepting parameters and return paginated response
    getAllUsers: builder.query<PaginatedUsersResponse, GetUsersParams>({
      query: (params) => {
        const { page = 1, limit = 10, keyword, role, city, country } = params;
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", limit.toString());

        if (keyword) queryParams.append("keyword", keyword);
        if (role && role !== "Any") queryParams.append("role", role);
        if (city) queryParams.append("city", city);
        if (country) queryParams.append("country", country);

        return `/users?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
      keepUnusedDataFor: 15, // Keeps data fresh for 15 seconds
    }),

    createUser: builder.mutation<User, AuthUser>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUser: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Fetch Activity Logs
    getActivityLogs: builder.query<ActivityLog[], void>({
      query: () => ({
        url: "activity-logs",
        method: "GET",
      }),
      providesTags: ["ActivityLog"],
      keepUnusedDataFor: 30,
      // Local error handling if needed
      transformErrorResponse: (response): ApiError => {
        if ("status" in response) {
          return response as ApiError;
        }
        return {
          status: 500,
          data: {
            message: "An unexpected error occurred",
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetActivityLogsQuery,
} = adminApi;

export default adminApi;
