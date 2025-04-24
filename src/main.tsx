
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the application with proper providers
root.render(
  <React.StrictMode>
    <EnhancedErrorBoundary>
      <Router>
        <App />
      </Router>
    </EnhancedErrorBoundary>
  </React.StrictMode>
);
