
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use faster root creation and avoid strict mode for better performance
const renderApp = () => {
  const root = document.getElementById("root");
  if (root) createRoot(root).render(<App />);
};

// Check if the document is ready or still loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Add service worker registration if needed for offline functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.log('Service worker registration failed:', error);
    });
  });
}
