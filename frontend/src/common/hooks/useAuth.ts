import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './selector-dispatch-hooks';
import { selectCurrentUser, setAuthedUser, removeCurrentUser } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../app/apiSlice';
import type { LoginFields } from '../../app/types';
import { toErrorWithMessage } from '../utils/getErrorMessage';

const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = async (loginFields: LoginFields) => {
    try {
      const data = await loginMutation(loginFields).unwrap();
      const tokenInfo = {
        username: data.username!,
        token: data.token!,
      };
      localStorage.setItem('instacloneSCToken', JSON.stringify(tokenInfo));
      dispatch(setAuthedUser(tokenInfo));
    } catch (error) {
      throw toErrorWithMessage(error) as Error;
    }
  };

  const logout = () => {
    localStorage.removeItem('instacloneSCToken');
    dispatch(removeCurrentUser());
    navigate('/login');
  };

  return [useMemo(() => (user), [user]), { login, logout, isLoading }] as const;
};

export default useAuth;
