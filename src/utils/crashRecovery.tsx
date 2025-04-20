import React from 'react';
import { exportDataBackup, importDataBackup } from '@/services/storageService';
import { toast } from '@/hooks/use-toast';
import { debugStorage } from '@/services/storageUtils';

// Perform an emergency backup
export const emergencyBackup = (): boolean => {
  try {
    // Create backup data
    const backupData = exportDataBackup(true);
    if (!backupData) {
      console.error("Failed to create emergency backup");
      return false;
    }
    
    // Store in both sessionStorage (survives page reloads) and localStorage
    sessionStorage.setItem('emergencyBackup', backupData);
    localStorage.setItem('emergencyBackup', backupData);
    localStorage.setItem('emergencyBackupTime', new Date().toISOString());
    
    console.log("Emergency backup created successfully");
    return true;
  } catch (error) {
    console.error("Error creating emergency backup:", error);
    return false;
  }
};

// Check if emergency backup exists
export const hasEmergencyBackup = (): boolean => {
  try {
    return !!localStorage.getItem('emergencyBackup') || !!sessionStorage.getItem('emergencyBackup');
  } catch (error) {
    return false;
  }
};

// Restore from emergency backup
export const restoreFromEmergencyBackup = (): boolean => {
  try {
    // Try to get backup from sessionStorage first (more recent)
    let backup = sessionStorage.getItem('emergencyBackup');
    
    // If not found, try localStorage
    if (!backup) {
      backup = localStorage.getItem('emergencyBackup');
    }
    
    if (!backup) {
      console.error("No emergency backup found");
      return false;
    }
    
    // Import the backup data
    const success = importDataBackup(backup);
    
    if (success) {
      // Clear the emergency backup
      sessionStorage.removeItem('emergencyBackup');
      localStorage.removeItem('emergencyBackup');
      localStorage.removeItem('emergencyBackupTime');
      
      console.log("Successfully restored from emergency backup");
      return true;
    } else {
      console.error("Failed to restore from emergency backup");
      return false;
    }
  } catch (error) {
    console.error("Error restoring from emergency backup:", error);
    return false;
  }
};

// Set up automatic emergency backups and crash detection
export const setupCrashRecovery = () => {
  // Create backup periodically
  const backupInterval = setInterval(() => {
    emergencyBackup();
  }, 60000); // Every minute
  
  // Set up beforeunload handler to detect potential crashes
  window.addEventListener('beforeunload', () => {
    emergencyBackup();
  });
  
  // Set up error handler for uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    emergencyBackup();
    
    // Log detailed info about the error
    debugStorage();
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    emergencyBackup();
  });
  
  // Check for recovery on startup
  const checkForRecoveryOnStartup = () => {
    try {
      if (hasEmergencyBackup()) {
        const backupTime = localStorage.getItem('emergencyBackupTime');
        const formattedTime = backupTime ? new Date(backupTime).toLocaleString() : 'unknown time';
        
        // Use a function to create the button instead of direct JSX
        const createRestoreButton = () => (
          <button 
            onClick={handleRestoreFromCrash} 
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Restore
          </button>
        );

        // Use the function to create the action
        toast({
          title: "System Recovery Available",
          description: `A backup from ${formattedTime} was found. Would you like to restore it?`,
          action: createRestoreButton(),
          duration: 10000 // Show for 10 seconds
        });
      }
    } catch (error) {
      console.error("Error checking for recovery:", error);
    }
  };
  
  // Handle restore from crash
  const handleRestoreFromCrash = () => {
    try {
      const success = restoreFromEmergencyBackup();
      
      if (success) {
        toast.success("System restored successfully");
        // Reload page to refresh all components
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Failed to restore system");
      }
    } catch (error) {
      console.error("Error during crash recovery:", error);
      toast.error("Error during recovery process");
    }
  };
  
  // Run the check
  setTimeout(checkForRecoveryOnStartup, 1000);
  
  // Return cleanup function
  return () => {
    clearInterval(backupInterval);
    window.removeEventListener('beforeunload', emergencyBackup);
  };
};

// Helper functions for auto-save detection with USB drives
export const setupUSBDetection = () => {
  try {
    if ('storage' in navigator && 'ondevicechange' in navigator.storage) {
      navigator.storage.ondevicechange = () => {
        console.log('Storage device change detected (USB insertion/removal)');
        emergencyBackup();
        toast({
          title: "Storage Device Change Detected",
          description: "Data has been automatically backed up for safety",
        });
      };
      
      console.log("USB storage change detection initialized");
      return true;
    } else {
      console.log("USB storage detection not supported in this browser");
      return false;
    }
  } catch (error) {
    console.error("Error setting up USB detection:", error);
    return false;
  }
};

// Function to check data integrity
export const checkDataIntegrity = (): boolean => {
  try {
    // Check essential data structures
    const essentialKeys = [
      'locations',
      'currentFinancialYear',
      'financialYears'
    ];
    
    const missingKeys = essentialKeys.filter(key => !localStorage.getItem(key));
    
    if (missingKeys.length > 0) {
      console.error(`Data integrity check failed: Missing keys - ${missingKeys.join(', ')}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking data integrity:", error);
    return false;
  }
};

// Function to perform system health check
export const performSystemHealthCheck = () => {
  try {
    const results = {
      storageAvailable: false,
      dataIntegrity: false,
      recoveryAvailable: false,
      storageUsage: 0,
      storageLimit: 0
    };
    
    // Check if localStorage is available
    results.storageAvailable = typeof localStorage !== 'undefined';
    
    // Check data integrity
    results.dataIntegrity = checkDataIntegrity();
    
    // Check for recovery options
    results.recoveryAvailable = hasEmergencyBackup();
    
    // Check storage usage
    if (results.storageAvailable) {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalSize += (localStorage.getItem(key) || '').length;
        }
      }
      
      results.storageUsage = totalSize;
      results.storageLimit = 5 * 1024 * 1024; // 5MB limit in browsers
    }
    
    return results;
  } catch (error) {
    console.error("Error performing system health check:", error);
    return null;
  }
};

// Export all existing functions
export { 
  emergencyBackup, 
  hasEmergencyBackup, 
  restoreFromEmergencyBackup, 
  setupUSBDetection, 
  checkDataIntegrity, 
  performSystemHealthCheck 
};
