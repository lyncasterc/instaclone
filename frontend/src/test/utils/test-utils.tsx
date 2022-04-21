import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import theme from '../../app/theme';
import { store } from '../../app/store';
import { initAuthedUser } from '../../features/auth/authSlice';

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

/* For rendering components reliant on React Router.
  When given a 'route', it will push that route to history stack and starts the app from that route.
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
// Mocks a logged in state on the browser and Redux store, for use in React unit/integration tests
export const mockLogin = ({ fakeTokenInfo }: MockLogInOptions) => {
  localStorage.setItem('instacloneSCToken', JSON.stringify(fakeTokenInfo));
  store.dispatch(initAuthedUser());
};

export * from '@testing-library/react';
export { customRender as render };
