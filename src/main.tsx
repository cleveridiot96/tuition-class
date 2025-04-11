
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from '@/hooks/use-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
