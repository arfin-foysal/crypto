import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./slices/authSlice";
import { showLoader, hideLoader } from "./slices/loaderSlice";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Only show full-screen loader for non-GET requests
  const isGetRequest = !args.method || args.method.toUpperCase() === 'GET';
  
  if (!isGetRequest) {
    api.dispatch(showLoader());
  }
  
  try {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      toast.error("Session Expired. Please login again");
      api.dispatch(logout());
      setTimeout(() => {
        window.location.reload(false);
      }, 3000);
    }
    return result;
  } finally {
    if (!isGetRequest) {
      api.dispatch(hideLoader());
    }
  }
};

export const server = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin"],
  reducerPath: "apiSlice",
  endpoints: (builder) => ({}),
});
