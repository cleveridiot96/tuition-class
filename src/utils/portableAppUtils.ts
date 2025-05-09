
import { toast } from "sonner";
import { isFileProtocol, isOffline, registerOfflineHandlers } from "./offlineDetection";

/**
 * Portable mode flag in localStorage
 */
export const PORTABLE_MODE_KEY = 'portableMode';

/**
 * Check if the application is in portable mode
 */
export const isPortableMode = (): boolean => {
  // Check for portable mode flag in localStorage
  const portableMode = localStorage.getItem(PORTABLE_MODE_KEY) === 'true';
  
  // Check for file protocol (always indicates portable mode)
  const fileProtocol = isFileProtocol();
  
  // Check for portable=true in URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const portableParam = urlParams.get('portable') === 'true';
  
  return portableMode || fileProtocol || portableParam;
};

/**
 * Initialize portable app mode
 */
export const initializePortableApp = (): void => {
  // If we're running in portable mode, register offline handlers
  if (isPortableMode()) {
    console.log("Initializing portable app mode");
    localStorage.setItem(PORTABLE_MODE_KEY, 'true');
    
    // Register offline handlers
    registerOfflineHandlers(
      () => {
        console.log("App is offline in portable mode");
        // Being offline in portable mode is normal, so no need for alerts
      },
      () => {
        console.log("App is back online in portable mode");
        // This shouldn't matter in portable mode, but we log it anyway
      }
    );
  }
};

/**
 * Ensure portable data is loaded
 */
export const ensurePortableDataLoaded = (): void => {
  if (!isPortableMode()) return;
  
  try {
    // Create default schema if data doesn't exist
    const requiredKeys = ['suppliers', 'customers', 'brokers', 'agents', 'transporters', 'masters'];
    
    requiredKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    
    // Set default locations if they don't exist
    if (!localStorage.getItem('locations')) {
      localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
    }
    
    console.log("Portable data schema initialized successfully");
  } catch (error) {
    console.error("Error initializing portable data:", error);
  }
};

/**
 * Exit portable mode
 */
export const exitPortableMode = (): void => {
  localStorage.removeItem(PORTABLE_MODE_KEY);
  sessionStorage.removeItem('portable-mode-message');
  console.log("Exited portable mode");
  toast.success("Exited portable mode");
};

/**
 * Check if the browser supports offline storage
 */
export const checkOfflineStorageSupport = (): boolean => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};
