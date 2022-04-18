import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, NewUserFields, LoginFields } from './types';
import type { AuthState } from '../features/auth/authSlice';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    addUser: builder.mutation<User, NewUserFields>({
      query: (newUserFields) => ({
        url: '/users',
        method: 'POST',
        body: newUserFields,
      }),
      // invalidatesTags: ['User'],
    }),
    login: builder.mutation<AuthState, LoginFields>({
      query: (loginFields) => ({
        url: '/login',
        method: 'POST',
        body: loginFields,
      }),
    }),
  }),
});

export const { useAddUserMutation, useLoginMutation } = apiSlice;
