
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/global-dropdown-fixes.css'
import './styles/form-fixes.css'
import './styles/animations.css'
import { ToastProvider } from '@/hooks/toast/toast-context'
import { setupCrashRecovery, setupUSBDetection } from '@/utils/crashRecovery'
import RippleProvider from '@/components/RippleProvider'

// Setup crash recovery system
setupCrashRecovery();

// Setup USB drive detection if supported
setupUSBDetection();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RippleProvider>
        <App />
      </RippleProvider>
    </ToastProvider>
  </React.StrictMode>,
)
