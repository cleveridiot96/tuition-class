
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from '@/hooks/use-toast';
import { Toaster } from 'sonner';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </ToastProvider>
  </React.StrictMode>
);
