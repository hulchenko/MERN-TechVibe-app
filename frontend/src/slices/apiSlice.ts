// parent slice for cart/products/users slices

import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { clearCredentials } from "./authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

const baseQueryAuthMiddleware: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta> = async (args, api, options) => {
  // kick unauthorized user out on error
  const result = await baseQuery(args, api, options);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryAuthMiddleware,
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
});

export default apiSlice.reducer;
