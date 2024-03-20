/* eslint-disable max-len */
import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import theme from '../../app/theme';
import authReducer, { removeAuthenticatedState, setAuthenticatedState } from '../../features/auth/authSlice';
import { apiSlice } from '../../app/apiSlice';

export const testStore = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Provider store={testStore}>
        {children}
      </Provider>
    </MantineProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Providers, ...options });

/**
 * Renders a component wrapped inside BrowserRouter for use in RTL tests.
 * @param {ReactElement} ui - React component being tested.
 * @param {{route: string}} options - optional options object.
 * @param {string} options.route - sets the initial pathname. Defaults to '/'.
 * @example
 * // renders <SomeComponent> and destructures UserEvent object.
 * const { user } = renderWithRouter(<SomeComponent />);
 */
export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' } = {},
) => {
  window.history.pushState({}, 'string', route);
  const view = customRender(
    <BrowserRouter>
      {ui}
    </BrowserRouter>,
  );
  return {
    user: userEvent.setup(),
    ...view,
  };
};

interface MockLogInOptions {
  fakeTokenInfo: { username: string, accessToken: string }
}

/**
 * Mocks a logged in state in Redux.
 * @param {{ username: string, token: string }} fakeTokenInfo - The mock token object
 * @param {string} fakeTokenInfo.username - The test user's username
 * @param {string} fakeTokenInfo.token - The mock token. Can be any string.
 */
export const mockLogin = ({ fakeTokenInfo }: MockLogInOptions) => {
  testStore.dispatch(setAuthenticatedState(fakeTokenInfo));
};

/**
 * Mocks a logged out state by resetting the `api` and
 * clearing the authenticated state in the Redux store.
 *
 * @param {{ resetApiState: boolean }} options - The options object
 * @param {boolean} options.resetApiState - Boolean variable that will reset the `api` state if set to true.
 */
export const mockLogout = ({ resetApiState }: {
  resetApiState: boolean
}) => {
  if (resetApiState) {
    testStore.dispatch(apiSlice.util.resetApiState());
  }

  testStore.dispatch(removeAuthenticatedState());
};

/**
 * Converts a data URI to a Blob object.
 * @param {string} dataURI - The data URI to convert.
 * @returns {Blob} A Blob object.
 * @example const dataURI = 'data:image/jpeg;base64,/9j/4AAQSk...'; // Your data URI here
const blob = dataURItoBlob(dataURI);
const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
 */
export function dataURItoBlob(dataURI: string) {
  // Split the data URI into parts
  const parts = dataURI.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];

  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Create a new Blob object
  return new Blob([ab], { type: mimeString });
}

export * from '@testing-library/react';
export { customRender as render };
