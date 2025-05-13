
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { initializePortableApp } from './utils/portableAppUtils';
import { AppProviders } from './components/AppProviders';

// Initialize portable app features if needed
initializePortableApp();

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the application with proper providers
root.render(
  <React.StrictMode>
    <HashRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </HashRouter>
  </React.StrictMode>
);
