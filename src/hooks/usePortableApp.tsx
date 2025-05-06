
import { useEffect } from 'react';
import { initializePortableApp, isPortableMode } from '@/utils/portableAppUtils';
import { toast } from 'sonner';

export function usePortableApp() {
  useEffect(() => {
    if (isPortableMode()) {
      console.log("Initializing portable app");
      try {
        initializePortableApp();
        
        // Set a session flag to prevent showing the message multiple times
        const shownMessage = sessionStorage.getItem('portable-mode-message');
        if (!shownMessage) {
          toast.info("Running in portable mode", {
            description: "Your data is stored in your browser's local storage",
            duration: 5000,
          });
          sessionStorage.setItem('portable-mode-message', 'true');
        }
      } catch (error) {
        console.error("Failed to initialize portable app:", error);
        toast.error("Error initializing portable app");
      }
    }
  }, []);
  
  return { isPortableMode: isPortableMode() };
}
