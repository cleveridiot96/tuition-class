
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { KeyboardShortcutsProvider } from './components/KeyboardShortcutsProvider';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <KeyboardShortcutsProvider>
        <App />
      </KeyboardShortcutsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
