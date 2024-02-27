import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  createEntityAdapter,
  EntityState,
  createSelector,
} from '@reduxjs/toolkit';
import {
  type User,
  type NewUserFields,
  type LoginFields,
  type UpdatedUserFields,
  type Post,
  type NewPostFields,
} from './types';
import type { AuthState } from '../features/auth/authSlice';
// eslint-disable-next-line import/no-cycle
import { RootState } from './store';

// Normalizing users cache
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.username,
});

interface EditUserMutationArg {
  updatedUserFields: UpdatedUserFields,
  id: string,
}

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).auth;
      if (token) headers.set('authorization', `bearer ${token}`);

      return headers;
    },
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
    getUsers: builder.query<EntityState<User>, void>({
      query: () => '/users',
      transformResponse: (response: User[]) => (
        usersAdapter.setAll(usersAdapter.getInitialState(), response)
      ),
      providesTags: ['User'],
    }),
    editUser: builder.mutation<User, EditUserMutationArg>({
      query: ({ updatedUserFields, id }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: updatedUserFields,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUserImage: builder.mutation<User, string>({
      query: (id) => ({
        url: `/users/${id}/image`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    addPost: builder.mutation<Post, NewPostFields>({
      query: (newPostFields) => ({
        url: '/posts',
        method: 'POST',
        body: newPostFields,
      }),
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: ['Post'],
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

export const {
  useAddUserMutation,
  useLoginMutation,
  useGetUsersQuery,
  useEditUserMutation,
  useDeleteUserImageMutation,
  useAddPostMutation,
  useGetPostByIdQuery,
} = apiSlice;

const selectUsersResult = apiSlice.endpoints.getUsers.select();
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserByUsername,
} = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? usersAdapter.getInitialState(),
);
