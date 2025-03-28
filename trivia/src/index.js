import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import App from './App';
import {AuthContextProvider} from './context/AuthContext'
import process from 'process';
window.process = process;


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