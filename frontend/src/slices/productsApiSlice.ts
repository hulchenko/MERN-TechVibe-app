import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { ProductInterface, ProductPaginationRes } from "../interfaces/product.interface";
import { ReviewInterface } from "../interfaces/review.interface";
import { UploadImageRes } from "../types/upload-image-response.type";
import { apiSlice } from "./apiSlice";
import { FilterParams } from "../types/filter-params.type";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductPaginationRes, FilterParams>({
      query: ({ pageNum, keyword }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNum,
        },
      }),
      keepUnusedDataFor: 5,
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
    uploadProductImage: builder.mutation<UploadImageRes, FormData>({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
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
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
