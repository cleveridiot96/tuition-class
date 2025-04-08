
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for offline functionality
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
};

// Use faster root creation and avoid strict mode for better performance
const renderApp = () => {
  const root = document.getElementById("root");
  if (root) createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Check if the document is ready or still loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Register service worker for offline capabilities
registerServiceWorker();

// Block any outbound connections (except for development needs)
if (process.env.NODE_ENV === 'production') {
  // Override fetch to prevent any external requests in production
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.url;
    
    // Only allow requests to own origin
    if (!url.startsWith('/') && !url.startsWith(window.location.origin)) {
      console.warn('Blocked external request to:', url);
      return Promise.reject(new Error('External connections are disabled for privacy'));
    }
    
    return originalFetch.apply(this, [input, init]);
  };
}
