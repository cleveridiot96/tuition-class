
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Register service worker for offline functionality
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

// Block any outbound connections (except for development needs)
if (process.env.NODE_ENV === 'production') {
  // Override fetch to prevent any external requests in production
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const urlString = typeof input === 'string' 
      ? input 
      : input instanceof Request 
        ? input.url 
        : input instanceof URL 
          ? input.toString() 
          : "";
    
    // Only allow requests to own origin
    if (!urlString.startsWith('/') && !urlString.startsWith(window.location.origin)) {
      console.warn('Blocked external request to:', urlString);
      return Promise.reject(new Error('External connections are disabled for privacy'));
    }
    
    return originalFetch.apply(this, [input, init]);
  };
}
