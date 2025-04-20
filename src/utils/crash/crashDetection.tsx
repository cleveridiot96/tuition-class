
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { emergencyBackup, hasEmergencyBackup, restoreFromEmergencyBackup } from '@/utils/backup/emergencyBackup';

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
        
        // Show recovery notification
        toast({
          title: "System Recovery Available",
          description: `A backup from ${formattedTime} was found. Would you like to restore it?`,
          action: (
            <button 
              onClick={handleRestoreFromCrash} 
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Restore
            </button>
          ),
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
        toast({
          title: "System restored successfully",
          variant: "default"
        });
        // Reload page to refresh all components
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast({
          title: "Failed to restore system",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during crash recovery:", error);
      toast({
        title: "Error during recovery process",
        variant: "destructive"
      });
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
