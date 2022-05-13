import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  createEntityAdapter,
  EntityState,
  createSelector,
} from '@reduxjs/toolkit';
import type { User, NewUserFields, LoginFields } from './types';
import type { AuthState } from '../features/auth/authSlice';
// eslint-disable-next-line import/no-cycle
import { RootState } from './store';

// Normalizing users cache
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.username,
});

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
    getUsers: builder.query<EntityState<User>, void>({
      query: () => '/users',
      transformResponse: (response: User[]) => (
        usersAdapter.setAll(usersAdapter.getInitialState(), response)
      ),
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
