import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export type APIError = FetchBaseQueryError & {
  data: { message: string };
};
