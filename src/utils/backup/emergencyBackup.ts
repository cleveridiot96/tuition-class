
import { exportDataBackup, importDataBackup } from '@/services/storageService';

export const emergencyBackup = (): boolean => {
  try {
    const backupData = exportDataBackup(true);
    if (!backupData) {
      console.error("Failed to create emergency backup");
      return false;
    }
    
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

export const hasEmergencyBackup = (): boolean => {
  try {
    return !!localStorage.getItem('emergencyBackup') || !!sessionStorage.getItem('emergencyBackup');
  } catch (error) {
    return false;
  }
};

export const restoreFromEmergencyBackup = (): boolean => {
  try {
    let backup = sessionStorage.getItem('emergencyBackup') || localStorage.getItem('emergencyBackup');
    
    if (!backup) {
      console.error("No emergency backup found");
      return false;
    }
    
    const success = importDataBackup(backup);
    
    if (success) {
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
