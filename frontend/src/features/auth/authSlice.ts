import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { type RootState } from '../../app/store';

export interface AuthState {
  accessToken: string | null,
  username: string | null,
}

const initialState: AuthState = {
  accessToken: null,
  username: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticatedState: (
      state,
      {
        payload: { username, accessToken },
      }: PayloadAction<{
        username: string,
        accessToken: string
      }>,
    ) => {
      state.username = username;
      state.accessToken = accessToken;
    },
    removeAuthenticatedState: (state) => {
      state.username = null;
      state.accessToken = null;
    },
    updateCurrentUsername: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.username = action.payload;
    },
  },
});

export const {
  setAuthenticatedState,
  removeAuthenticatedState,
  updateCurrentUsername,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.username;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
