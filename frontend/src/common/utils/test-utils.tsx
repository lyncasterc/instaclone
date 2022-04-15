import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import theme from '../../app/theme';
import { store } from '../../app/store';

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

// for rendering components reliant on React Router
// and accessing the history object
export const renderWithHistory = (children: ReactNode) => {
  const history = createMemoryHistory();
  const wrapper = customRender(
    <Router location={history.location} navigator={history}>
      {children}
    </Router>,
  );
  return { ...wrapper, history };
};

export * from '@testing-library/react';
export { customRender as render };
