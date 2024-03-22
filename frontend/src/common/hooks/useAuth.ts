import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './selector-dispatch-hooks';
import {
  selectCurrentUser,
  setAuthenticatedState,
  removeAuthenticatedState,
} from '../../features/auth/authSlice';
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshAccessTokenMutation,
} from '../../app/apiSlice';
import type { LoginFields } from '../../app/types';
import getErrorMessage, { toErrorWithMessage } from '../utils/getErrorMessage';

const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [
    refreshAccessTokenMutation,
  ] = useRefreshAccessTokenMutation();

  const login = async (loginFields: LoginFields) => {
    try {
      const data = await loginMutation(loginFields).unwrap();

      if (data.accessToken && data.username) {
        const loginResponseData = {
          username: data.username,
          accessToken: data.accessToken,
        };

        dispatch(setAuthenticatedState(loginResponseData));
      } else {
        throw new Error('Something went wrong. Try again.');
      }
    } catch (error) {
      throw toErrorWithMessage(error) as Error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const data = await refreshAccessTokenMutation().unwrap();

      if (data.accessToken && data.username) {
        const refreshResponseData = {
          username: data.username,
          accessToken: data.accessToken,
        };

        dispatch(setAuthenticatedState(refreshResponseData));
      }
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error(getErrorMessage(error));
    }

    dispatch(removeAuthenticatedState());
    navigate('/login');
  };

  return [useMemo(() => (user), [user]), {
    login,
    logout,
    refreshAccessToken,
  }] as const;
};

export default useAuth;
