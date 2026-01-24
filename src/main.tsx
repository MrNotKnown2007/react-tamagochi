import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Глобальная функция для путей к ассетам
declare global {
  interface Window {
    getAssetPath: (path: string) => string;
  }
}

window.getAssetPath = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${cleanPath}`.replace(/\/+/g, '/');
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
