import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tạo root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render ứng dụng
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
