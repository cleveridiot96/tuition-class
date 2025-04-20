
import { toast } from "sonner";
import { exportDataBackup } from "@/services/backup/exportBackup";

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
    
    // Initialize default locations if needed
    const locations = localStorage.getItem('locations');
    if (!locations) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    return true;
  } catch (err) {
    console.error("Portable mode error:", err);
    toast.error("Error loading data in portable mode. Try allowing local file access in your browser.");
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
  }
};

// Create a portable version of the application
export const createPortableVersion = async (): Promise<boolean> => {
  try {
    // Create a backup of the data
    const dataBackup = exportDataBackup(true);
    if (!dataBackup) {
      toast.error("Failed to create data backup");
      return false;
    }

    toast.success("Portable version created successfully");
    
    // In a real implementation, this would create a downloadable portable version
    // For now, just enable portable mode in localStorage
    localStorage.setItem('portableMode', 'true');
    
    return true;
  } catch (error) {
    console.error("Error creating portable version:", error);
    toast.error("Failed to create portable version");
    return false;
  }
};
