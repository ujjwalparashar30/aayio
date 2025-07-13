import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  }),
  refetchOnFocus: true,
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "users/create",
        method: "POST",
        body: newUser,
      }),
    }),
    // Mutation to update a user (user.updated event)
    updateUser: builder.mutation({
      query: (updatedUser) => ({
        url: "users/update",
        method: "PUT",
        body: updatedUser,
      }),
    }),
    // Mutation to delete a user (user.deleted event)
    deleteUser: builder.mutation({
      query: (userToDelete) => ({
        url: "users/delete",
        method: "DELETE",
        body: userToDelete,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;
