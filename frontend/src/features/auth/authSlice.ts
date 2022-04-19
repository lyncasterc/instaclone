import {
  createSlice,
  PayloadAction,
  ThunkAction,
  AnyAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface AuthState {
  token: string | null,
  username: string | null,
}

const initialState: AuthState = {
  token: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthedUser: (
      state,
      { payload: { username, token } }: PayloadAction<{ username: string, token: string }>,
    ) => {
      state.username = username;
      state.token = token;
    },
    removeCurrentUser: (state) => {
      state.username = null;
      state.token = null;
    },
  },
});

export const { setAuthedUser, removeCurrentUser } = authSlice.actions;

export default authSlice.reducer;

export const initAuthedUser = (): ThunkAction<void, RootState, unknown, AnyAction> => {
  const token = localStorage.getItem('instacloneSCToken');
  return (dispatch) => {
    if (token) {
      const parsedToken = JSON.parse(token);
      dispatch(setAuthedUser(parsedToken));
    }
  };
};

export const selectCurrentUser = (state: RootState) => state.auth.username;
