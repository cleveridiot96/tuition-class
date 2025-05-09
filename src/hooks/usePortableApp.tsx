
import { useEffect, useState } from 'react';
import { initializePortableApp, isPortableMode, ensurePortableDataLoaded } from '@/utils/portableAppUtils';
import { toast } from 'sonner';

export function usePortableApp() {
  const [isInPortableMode, setIsInPortableMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const portableMode = isPortableMode();
    setIsInPortableMode(portableMode);
    
    if (portableMode) {
      console.log("Initializing portable app");
      try {
        initializePortableApp();
        ensurePortableDataLoaded();
        
        // Set a session flag to prevent showing the message multiple times
        const shownMessage = sessionStorage.getItem('portable-mode-message');
        if (!shownMessage) {
          toast.info("Running in portable mode", {
            description: "Your data is stored in your browser's local storage",
            duration: 5000,
          });
          sessionStorage.setItem('portable-mode-message', 'true');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize portable app:", error);
        toast.error("Error initializing portable app");
      }
    } else {
      setIsInitialized(true);
    }
  }, []);
  
  return { 
    isPortableMode: isInPortableMode, 
    isInitialized: isInitialized 
  };
}
