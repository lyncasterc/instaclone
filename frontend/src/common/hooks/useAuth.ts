import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from './selector-dispatch-hooks';
import { selectCurrentUser, setAuthedUser } from '../../features/authSlice';
import { useLoginMutation } from '../../app/apiSlice';
import type { LoginFields } from '../../app/types';

const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
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
      console.log(error);
    }
  };

  return [useMemo(() => (user), [user]), { login, isLoading }] as const;
};

export default useAuth;
