import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';
import React from 'react';
import custom_theme from './theme';
import './app.css'
ReactDOM.render(
      <ConfigProvider
        theme={custom_theme}
    >
  <BrowserRouter>
    <App />
  </BrowserRouter>,
    </ConfigProvider>,
  document.getElementById('root')
);