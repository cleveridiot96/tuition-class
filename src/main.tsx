
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { KeyboardShortcutsProvider } from './components/KeyboardShortcutsProvider';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the application
root.render(
  <React.StrictMode>
    <KeyboardShortcutsProvider>
      <App />
    </KeyboardShortcutsProvider>
  </React.StrictMode>
);
