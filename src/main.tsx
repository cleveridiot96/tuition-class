
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use faster root creation and avoid strict mode in production
const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
