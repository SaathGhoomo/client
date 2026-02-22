import React from 'react';
import ReactDOM from 'react-dom/client';

import { Toaster } from 'react-hot-toast';

import './tailwind.css';
import './theme.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
      }}
    />
  </AuthProvider>
);

