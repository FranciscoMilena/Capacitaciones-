import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes'; // Usa las rutas
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
