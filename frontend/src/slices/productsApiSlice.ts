import { PRODUCTS_URL } from "../constants";
import { ProductInterface, ProductPaginationRes } from "../interfaces/product.interface";
import { ReviewInterface } from "../interfaces/review.interface";
import { FilterParams } from "../types/filter-params.type";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductPaginationRes, FilterParams>({
      query: ({ pageNum, search }) => ({
        url: PRODUCTS_URL,
        params: {
          search,
          pageNum,
        },
      }),
      providesTags: ["Product"],
    }),
    getProductDetails: builder.query<ProductInterface, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<ProductInterface, ProductInterface>({
      query: (product) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<ProductInterface, ProductInterface>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    createReview: builder.mutation<void | { message: string }, ReviewInterface>({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query<ProductInterface[], void>({
      // top products for carousel view
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
