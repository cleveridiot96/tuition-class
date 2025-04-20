
import { exportDataBackup, importDataBackup } from '@/services/storageService';

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
