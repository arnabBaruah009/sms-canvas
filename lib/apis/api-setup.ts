import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/lib/redux/store";
import { SESSION_COOKIE_NAME } from "../utils/sessions.utils";

export enum HttpStatus {
  UNAUTHORIZED = 401,
}

// Error handler configuration
interface ErrorHandler {
  status: number;
  action: (error: any) => void;
}

// Error handlers registry
const errorHandlers: ErrorHandler[] = [
  {
    status: HttpStatus.UNAUTHORIZED,
    action: () => {
      if (typeof window !== "undefined") {
        // Clear the invalid session cookie before redirecting
        document.cookie =
          `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = "/auth/login";
      }
    },
  },
];

// Custom base query with interceptor
const baseQueryWithInterceptor = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_LOCAL_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.authSlice?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Enhanced base query with error interceptor
const baseQueryWithErrorInterceptor = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  const result = await baseQueryWithInterceptor(args, api, extraOptions);

  // Check if the response has an error status that needs handling
  if (result.error && "status" in result.error) {
    const errorStatus = result.error.status;
    const handler = errorHandlers.find((h) => h.status === errorStatus);

    if (handler) {
      handler.action(result.error);
    }
  }

  return result;
};

export const apiSetup = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithErrorInterceptor,
  tagTypes: [],
  endpoints: () => ({}),
});
