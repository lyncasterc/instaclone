import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import theme from '../../app/theme';
import { store } from '../../app/store';
import { initAuthedUser, removeCurrentUser } from '../../features/auth/authSlice';
import { apiSlice } from '../../app/apiSlice';

function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Provider store={store}>
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
      { ui }
    </BrowserRouter>,
  );
  return {
    user: userEvent.setup(),
    ...view,
  };
};

interface MockLogInOptions {
  fakeTokenInfo: { username: string, token: string }
}

/**
 * Mocks a logged in state in the DOM and Redux.
 * @param {{ username: string, token: string }} fakeTokenInfo - The mock token object
 * @param {string} fakeTokenInfo.username - The test user's username
 * @param {string} fakeTokenInfo.token - The mock token. Can be any string.
 */
export const mockLogin = ({ fakeTokenInfo }: MockLogInOptions) => {
  localStorage.setItem('instacloneSCToken', JSON.stringify(fakeTokenInfo));
  store.dispatch(initAuthedUser());
};

/**
 * Mocks a logged out state by resetting the `api`,
 * clearing the `auth` state and removing the application's JWT token from DOM.
 */
export const mockLogout = () => {
  store.dispatch(apiSlice.util.resetApiState());
  store.dispatch(removeCurrentUser());
  localStorage.removeItem('instacloneSCToken');
};

export * from '@testing-library/react';
export { customRender as render };
