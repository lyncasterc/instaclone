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
    updateCurrentUsername: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.username = action.payload;
    },
  },
});

export const { setAuthedUser, removeCurrentUser, updateCurrentUsername } = authSlice.actions;

export default authSlice.reducer;

/**
 * Updates the username in the stored JWT. Necessary for when user edits their username
 * so that the application can continue to display the correct updated username.
 * @param {string} username - the new username.
*/
export const updateAuthedUsername = (username: string):
ThunkAction<void, RootState, unknown, AnyAction> => {
  const token = localStorage.getItem('instacloneSCToken');
  return (dispatch) => {
    if (token) {
      const parsedToken = JSON.parse(token);
      const updatedUsernameToken = { ...parsedToken, username };
      localStorage.setItem('instacloneSCToken', JSON.stringify(updatedUsernameToken));
      dispatch(updateCurrentUsername(username));
    }
  };
};

export const selectCurrentUser = (state: RootState) => state.auth.username;
