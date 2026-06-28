import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Category, Product, ProductFormData } from "../../types/product";
import { getStoredToken, isTokenExpired } from "../../utils/token";
import { isLocalToken } from "../../utils/localUsers";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://api.escuelajs.co/api/v1";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getStoredToken();
      if (token && !isTokenExpired(token) && !isLocalToken(token)) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Category"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { offset?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/products",
        params: { offset: 0, limit: 20, ...(params ?? {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),
    createProduct: builder.mutation<Product, ProductFormData>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body: {
          title: body.title,
          price: body.price,
          description: body.description,
          categoryId: body.categoryId,
          images: body.images,
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; data: ProductFormData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: {
          title: data.title,
          price: data.price,
          description: data.description,
          categoryId: data.categoryId,
          images: data.images,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
