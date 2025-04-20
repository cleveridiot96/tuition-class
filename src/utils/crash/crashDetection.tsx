
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { debugStorage } from '@/services/storageUtils';
import { emergencyBackup, hasEmergencyBackup, restoreFromEmergencyBackup } from '../backup/emergencyBackup';

export const setupCrashRecovery = () => {
  const backupInterval = setInterval(() => {
    emergencyBackup();
  }, 60000);

  window.addEventListener('beforeunload', () => {
    emergencyBackup();
  });

  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    emergencyBackup();
    debugStorage();
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    emergencyBackup();
  });

  const handleRestoreFromCrash = () => {
    try {
      const success = restoreFromEmergencyBackup();
      
      if (success) {
        toast.success("System restored successfully");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Failed to restore system");
      }
    } catch (error) {
      console.error("Error during crash recovery:", error);
      toast.error("Error during recovery process");
    }
  };

  const checkForRecoveryOnStartup = () => {
    try {
      if (hasEmergencyBackup()) {
        const backupTime = localStorage.getItem('emergencyBackupTime');
        const formattedTime = backupTime ? new Date(backupTime).toLocaleString() : 'unknown time';

        const RestoreButton = () => (
          <button 
            onClick={handleRestoreFromCrash} 
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            Restore
          </button>
        );

        toast({
          title: "System Recovery Available",
          description: `A backup from ${formattedTime} was found. Would you like to restore it?`,
          action: <RestoreButton />,
          duration: 10000
        });
      }
    } catch (error) {
      console.error("Error checking for recovery:", error);
    }
  };

  setTimeout(checkForRecoveryOnStartup, 1000);

  return () => {
    clearInterval(backupInterval);
    window.removeEventListener('beforeunload', emergencyBackup);
  };
};
