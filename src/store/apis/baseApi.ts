// src/store/apis/baseQuery.ts
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../rootReducer";
import { addError } from "../slices/errorSlice";

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred";
const NETWORK_ERROR_MESSAGE = "Network error or server is unavailable";
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

/**
 * Extracts a user-friendly error message from the FetchBaseQueryError.
 */
const extractErrorMessage = (error: FetchBaseQueryError): string => {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Handle typical API errors
  if ("data" in error && error.data) {
    const errorData = (error.data as any).message || DEFAULT_ERROR_MESSAGE;
    return errorData;
  }

  // Handle network errors
  if ("error" in error && error.error) {
    return error.error.toString() || NETWORK_ERROR_MESSAGE;
  }

  // Handle status-based errors
  if ("status" in error) {
    switch (error.status) {
      case 401:
        return "Authentication required. Please log in.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Internal server error. Please try again later.";
      default:
        return DEFAULT_ERROR_MESSAGE;
    }
  }

  return DEFAULT_ERROR_MESSAGE;
};

/**
 * Configures the base query with common settings and error handling.
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // Include cookies in requests
  timeout: TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Cache-Control", "no-store");

    return headers;
  },
});

/**
 * Enhances the base query to handle errors globally.
 */
export const enhancedBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const errorMessage = extractErrorMessage(result.error);
    api.dispatch(addError(errorMessage));

    // Optional: Integrate with a logging service here
    console.error("API Error:", {
      endpoint: typeof args === "string" ? args : args.url,
      error: result.error,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
};
