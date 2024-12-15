import { AWS_URL, PAYPAL_URL } from "../constants";
import { AWSCredentials } from "../types/aws-creds.type";
import { PayPalClientId } from "../types/paypal-client.type";
import { apiSlice } from "./apiSlice";

export const externalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAWSCredentials: builder.query<AWSCredentials, void>({
      query: () => ({
        url: AWS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getPayPalClientId: builder.query<PayPalClientId, void>({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetAWSCredentialsQuery, useGetPayPalClientIdQuery } = externalApiSlice;
