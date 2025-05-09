
/**
 * Utility functions for handling offline functionality
 */

// Check if we're currently offline
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

// Register online/offline event handlers
export const registerOfflineHandlers = (
  onOffline: () => void = () => {},
  onOnline: () => void = () => {}
): () => void => {
  const handleOffline = () => {
    console.log('App is offline');
    onOffline();
  };

  const handleOnline = () => {
    console.log('App is back online');
    onOnline();
  };

  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  // Return cleanup function
  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
};

// Enhance portability by using file protocol detection
export const isFileProtocol = (): boolean => {
  return window.location.protocol === 'file:';
};

// Check if navigating from launcher
export const isLaunchedFromLauncher = (): boolean => {
  return document.referrer.includes('launcher.html') || 
         window.location.search.includes('portable=true');
};

// Initialize offline mode
export const initializeOfflineMode = (): void => {
  // Register basic handlers that log status
  registerOfflineHandlers(
    () => console.log('Application is running in offline mode'),
    () => console.log('Application is now online')
  );
  
  // If using file protocol, set portable mode flag
  if (isFileProtocol() || isLaunchedFromLauncher()) {
    localStorage.setItem('portableMode', 'true');
    console.log('Running in portable file mode');
  }
};
