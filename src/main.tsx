
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Make sure React is available globally (important for hooks to work properly)
window.React = React;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
