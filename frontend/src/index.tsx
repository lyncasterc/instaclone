import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import App from './app/App';
import theme from './app/theme';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { initAuthedUser } from './features/auth/authSlice';
import { apiSlice } from './app/apiSlice';
/*  TODO: create a /validendpoint token to verify that the token is valid?
if valid, setAuthedUser */
store.dispatch(initAuthedUser());
store.dispatch(apiSlice.endpoints.getUsers.initiate());

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withNormalizeCSS
      theme={theme}
    >
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
