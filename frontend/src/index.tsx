import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './app/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider
      withNormalizeCSS
      theme={{
        colors: {
          instaBlue: ['#B3CAD9', '#95BBD3', '#75AED2', '#51A3D9', '#289CE7', '#1681C7', '#0095F6', '#2471A3', '#2C6388', '#305872'],
        },
        primaryColor: 'instaBlue',
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
