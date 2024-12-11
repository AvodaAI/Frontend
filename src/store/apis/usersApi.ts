// src/store/apis/usersApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { enhancedBaseQuery } from "./baseApi";
import type { User, UpdateUserDetailsRequest, DeleteUserAccountResponse } from "@/types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: enhancedBaseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get a user by ID
    getUserProfile: builder.query<User, string>({
      query: (id) => `/${id}/profile`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    
    // Update a user details
    updateUserDetails: builder.mutation<User, UpdateUserDetailsRequest>({
      query: ({ id, first_name, last_name, email }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { first_name, last_name, email },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Delete a user
    deleteUserAccount: builder.mutation<DeleteUserAccountResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ]
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserDetailsMutation,
  useDeleteUserAccountMutation,
} = usersApi;

export default usersApi;