import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { KeyboardShortcutsProvider } from './components/KeyboardShortcutsProvider';
import { optimizedStorage } from '@/services/core/storage-core';

// Pre-initialize the optimized storage
React.useEffect(() => {
  // Ensure critical data is loaded into memory cache
  optimizedStorage.get('locations');
  optimizedStorage.get('customers');
  optimizedStorage.get('suppliers');
  optimizedStorage.get('brokers');
  optimizedStorage.get('agents');
  optimizedStorage.get('transporters');
}, []);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <KeyboardShortcutsProvider>
        <App />
      </KeyboardShortcutsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
