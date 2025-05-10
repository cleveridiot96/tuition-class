
import { useEffect, useState, useCallback } from 'react';
import { isPortableMode, ensurePortableDataLoaded, initializePortableApp } from '@/utils/portableAppUtils';
import { toast } from 'sonner';
import { isOffline } from '@/utils/offlineDetection';

export function usePortableApp() {
  const [isInPortableMode, setIsInPortableMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isInOfflineMode, setIsInOfflineMode] = useState<boolean>(false);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  // Create a stable function to verify and initialize critical data
  const verifyDataExists = useCallback(() => {
    try {
      // Check if these keys exist and are valid arrays
      const criticalDataKeys = ['suppliers', 'customers', 'brokers', 'agents', 'transporters', 'masters'];
      
      criticalDataKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (!data) {
          console.warn(`Missing ${key} data, initializing with empty array`);
          localStorage.setItem(key, JSON.stringify([]));
        } else {
          try {
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) {
              console.warn(`${key} is not an array, resetting to empty array`);
              localStorage.setItem(key, JSON.stringify([]));
            }
          } catch (e) {
            console.error(`Invalid JSON for ${key}, resetting to empty array`);
            localStorage.setItem(key, JSON.stringify([]));
          }
        }
      });
      
      console.log("Critical data verified and initialized if needed");
    } catch (error) {
      console.error("Error verifying critical data:", error);
    }
  }, []);

  useEffect(() => {
    // Check if we're in portable mode
    const portableMode = isPortableMode();
    setIsInPortableMode(portableMode);
    
    // Check if we're offline
    const offline = isOffline();
    setIsInOfflineMode(offline);
    
    if (portableMode) {
      console.log("Initializing portable app");
      try {
        // Initialize portable app
        initializePortableApp();
        
        try {
          // Ensure data is loaded and handle any potential errors
          ensurePortableDataLoaded();
          console.log("Portable data loaded successfully");
          setDataLoadError(null);
          
          // Verify that critical data for dropdowns is available
          verifyDataExists();
          
        } catch (dataError) {
          console.error("Error loading portable data:", dataError);
          setDataLoadError(dataError instanceof Error ? dataError.message : "Failed to load application data");
          
          // Show error message but still continue - we'll initialize with default data
          toast.error("Error loading data", {
            description: "Using default empty data. Some dropdowns may be empty.",
            duration: 8000,
          });
          
          // Initialize critical data with empty arrays to prevent errors
          try {
            const criticalDataKeys = ['suppliers', 'customers', 'brokers', 'agents', 'transporters', 'masters'];
            criticalDataKeys.forEach(key => {
              localStorage.setItem(key, JSON.stringify([]));
            });
            console.log("Initialized critical data with empty arrays after error");
          } catch (initError) {
            console.error("Failed to initialize critical data after error:", initError);
          }
        }
        
        // Show portable mode message only once per session
        const shownMessage = sessionStorage.getItem('portable-mode-message');
        if (!shownMessage) {
          toast.info("Running in portable mode", {
            description: "Your data is stored in your browser's local storage",
            duration: 5000,
          });
          sessionStorage.setItem('portable-mode-message', 'true');
        }
        
        // If we're offline, show a message
        if (offline) {
          toast.info("You are currently offline", {
            description: "Application will continue to work with local data",
            duration: 5000,
          });
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize portable app:", error);
        toast.error("Error initializing portable app", {
          description: error instanceof Error ? error.message : "Please check your browser's storage permissions"
        });
      }
    } else {
      setIsInitialized(true);
    }
    
    // Add event listeners for online/offline status
    const handleOnline = () => {
      setIsInOfflineMode(false);
      toast.success("You are back online", { duration: 3000 });
    };
    
    const handleOffline = () => {
      setIsInOfflineMode(true);
      toast.info("You are offline", {
        description: "Application will continue to work with local data",
        duration: 5000,
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [verifyDataExists]);
  
  return { 
    isPortableMode: isInPortableMode,
    isOffline: isInOfflineMode, 
    isInitialized: isInitialized,
    dataLoadError: dataLoadError
  };
}
