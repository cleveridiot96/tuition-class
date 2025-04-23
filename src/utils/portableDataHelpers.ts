
import { toast } from "sonner";
import { getLocations } from "@/services/storageUtils";

// Helper function to check if we're running in portable mode
export const isPortableMode = (): boolean => {
  return window.location.protocol === 'file:' || 
    window.location.href.includes('portable=true') ||
    localStorage.getItem('portableMode') === 'true';
};

// Helper function to ensure data is properly loaded in portable mode
export const ensurePortableDataLoaded = (): boolean => {
  if (!isPortableMode()) return true;
  
  try {
    // Check if we can access localStorage in portable mode
    const testKey = 'portable-test-' + Date.now();
    localStorage.setItem(testKey, 'test');
    const testValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (testValue !== 'test') {
      console.error("Portable mode storage test failed");
      toast.error("Error: Cannot access storage in portable mode. Try using a different browser.");
      return false;
    }
    
    // Check for data in the initialData key
    const initialData = localStorage.getItem('initialData');
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        // Import data to localStorage if not already there
        if (!localStorage.getItem('locations')) {
          for (const key in data) {
            if (!localStorage.getItem(key)) {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          }
          console.log("Imported initial data from portable mode");
          window.dispatchEvent(new Event('storage'));
        }
      } catch (e) {
        console.error("Error parsing initial data:", e);
      }
    }
    
    // Initialize default locations if needed
    const locations = localStorage.getItem('locations');
    if (!locations) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    return true;
  } catch (err) {
    console.error("Portable mode error:", err);
    toast.error("Error loading data in portable mode. Try using Chrome or Edge browser with file access enabled.");
    return false;
  }
};

// Helper function to fix common portable app issues
export const fixPortableAppIssues = (): void => {
  if (!isPortableMode()) return;
  
  try {
    // Ensure default locations exist
    const locations = localStorage.getItem('locations');
    if (!locations || locations === '[]') {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    // Ensure financial year is set
    const currentYear = localStorage.getItem('currentFinancialYear');
    if (!currentYear) {
      const now = new Date();
      const yearEnd = now.getMonth() >= 3 ? now.getFullYear() + 1 : now.getFullYear();
      const yearStart = yearEnd - 1;
      localStorage.setItem('currentFinancialYear', `${yearStart}-${yearEnd}`);
    }
    
    // Ensure master data arrays exist
    const masterArrays = ['suppliers', 'customers', 'agents', 'brokers', 'transporters'];
    masterArrays.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    
    // Register periodic local storage check
    setInterval(() => {
      try {
        const checkKey = `check-${Date.now()}`;
        localStorage.setItem(checkKey, "test");
        localStorage.removeItem(checkKey);
      } catch (error) {
        console.error("Local storage access error:", error);
        toast.error("Storage access error. Please refresh the page.");
      }
    }, 60000); // Check every minute
    
    console.log("Portable app settings verified and fixed if needed");
  } catch (err) {
    console.error("Error fixing portable app issues:", err);
  }
};

// Call this function early in the app initialization
export const initializePortableApp = (): void => {
  if (isPortableMode()) {
    console.log("Running in portable mode");
    fixPortableAppIssues();
    ensurePortableDataLoaded();
    
    // Add offline detection
    window.addEventListener('online', () => {
      toast.success("Back online", { duration: 2000 });
    });
    
    window.addEventListener('offline', () => {
      toast.info("You are offline. The app will continue to work.", { duration: 4000 });
    });
  }
};

// Performance optimization helper
export const optimizeForSlowDevices = (): void => {
  // Detect slow device based on navigator.hardwareConcurrency
  const isSlowDevice = (): boolean => {
    if (!navigator.hardwareConcurrency) return true;
    return navigator.hardwareConcurrency <= 2;
  };
  
  // Apply performance optimizations for slow devices
  if (isSlowDevice()) {
    console.log("Slow device detected, applying performance optimizations");
    
    // Reduce animation durations
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
    
    // Disable some transitions
    document.documentElement.classList.add('reduce-motion');
    
    // Reduce UI complexity where possible
    localStorage.setItem('low-performance-mode', 'true');
  }
};
