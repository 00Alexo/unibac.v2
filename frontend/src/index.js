import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './css/home.css';
import './css/minaAi.css';
import './css/others.css'
import './css/cropper.css'
import './css/cropper.min.css'
import './css/signInUp.css'
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