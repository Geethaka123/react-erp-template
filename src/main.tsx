import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from '@/providers/AppProvider';
import { AppRoutes } from '@/routes';

// Remove default index.css if not using it, or keep for basic reset
// import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>,
);
