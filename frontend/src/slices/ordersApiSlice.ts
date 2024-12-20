import { OrderResponseBody } from "@paypal/paypal-js";
import { ORDERS_URL } from "../constants";
import { OrderInterface, OrderPaginationRes } from "../interfaces/order.interface";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderInterface, object>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query<OrderInterface, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation<OrderInterface, { orderId: string; details: OrderResponseBody }>({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    getMyOrders: builder.query<OrderPaginationRes, { pageNum: string }>({
      query: ({ pageNum }) => ({
        url: `${ORDERS_URL}/my-orders`,
        params: { pageNum },
      }),
    }),
    getAllOrders: builder.query<OrderPaginationRes, { pageNum: string }>({
      query: ({ pageNum }) => ({
        url: ORDERS_URL,
        params: {
          pageNum,
        },
      }),
    }),
    deliverOrder: builder.mutation<OrderInterface, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetMyOrdersQuery, useGetAllOrdersQuery, useDeliverOrderMutation } =
  ordersApiSlice;
