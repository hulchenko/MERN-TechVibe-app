import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type MessageProps = {
  title: string;
  color?: string;
  description?: string | FetchBaseQueryError | SerializedError;
};
