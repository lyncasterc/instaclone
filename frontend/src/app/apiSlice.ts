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
  type Comment,
  type GetReplyCommentsRequestFields,
  type NewCommentFields,
  type DeleteCommentRequestFields,
  type NewLikeRequestFields,
} from './types';
import { type AuthState } from '../features/auth/authSlice';
import { type RootState } from './store';

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
      const { accessToken } = (getState() as RootState).auth;

      if (accessToken) {
        headers.set('authorization', `bearer ${accessToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ['User', 'Post', 'Comment'],
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
    followUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    unfollowUserById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}/unfollow`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    addPost: builder.mutation<Post, NewPostFields>({
      query: (newPostFields) => ({
        url: '/posts',
        method: 'POST',
        body: newPostFields,
      }),
      invalidatesTags: ['User'],
    }),
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: ['Post'],
    }),
    deletePostById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getParentCommentsByPostId: builder.query<Comment[], string>({
      query: (id) => `/posts/${id}/comments`,
      providesTags: ['Comment'],
    }),
    getRepliesByParentCommentId: builder.query<Comment[], GetReplyCommentsRequestFields>({
      query: ({ postId, parentCommentId }) => `/posts/${postId}/comments/${parentCommentId}`,
      providesTags: ['Comment'],
    }),
    addComment: builder.mutation<void, NewCommentFields>({
      query: ({ postId, body, parentComment }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: {
          body,
          parentComment,
        },
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteCommentById: builder.mutation<void, DeleteCommentRequestFields>({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
    likeEntity: builder.mutation<void, NewLikeRequestFields>({
      query: (newLikeFields) => ({
        url: '/likes',
        method: 'POST',
        body: newLikeFields,
      }),
    }),
    unlikeEntityById: builder.mutation<void, string>({
      query: (entityId) => ({
        url: `/likes/${entityId}`,
        method: 'DELETE',
      }),
    }),
    getEntityLikeCountByID: builder.query<{ likeCount: number }, string>({
      query: (entityId) => `/likes/${entityId}/likeCount`,
    }),
    getEntityLikeUsersByID: builder.query<{
      likes: { username: string, id: string }[]
    }, string>({
      query: (entityId) => `/likes/${entityId}/likes`,
    }),
    getHasUserLikedEntity: builder.query<{ hasLiked: boolean }, string>({
      query: (entityId) => `/likes/${entityId}/hasLiked`,
    }),
    login: builder.mutation<AuthState, LoginFields>({
      query: (loginFields) => ({
        url: '/auth/login',
        method: 'POST',
        body: loginFields,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    refreshAccessToken: builder.mutation<AuthState, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include',
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
  useDeletePostByIdMutation,
  useFollowUserByIdMutation,
  useUnfollowUserByIdMutation,
  useGetParentCommentsByPostIdQuery,
  useGetRepliesByParentCommentIdQuery,
  useAddCommentMutation,
  useDeleteCommentByIdMutation,
  useLikeEntityMutation,
  useUnlikeEntityByIdMutation,
  useGetEntityLikeCountByIDQuery,
  useGetEntityLikeUsersByIDQuery,
  useGetHasUserLikedEntityQuery,
  useLogoutMutation,
  useRefreshAccessTokenMutation,
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
