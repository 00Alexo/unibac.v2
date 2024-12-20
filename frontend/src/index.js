import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './css/home.css'
import { NextUIProvider } from '@nextui-org/react';
import App from './App';
import {AuthContextProvider} from './context/AuthContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <NextUIProvider>
      <App />
    </NextUIProvider>
    </AuthContextProvider>
  </React.StrictMode>
);