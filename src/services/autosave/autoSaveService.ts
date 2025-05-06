
import { exportDataBackup, importDataBackup } from '../storageUtils';

// Function to perform auto-save (for USB drive ejection scenarios)
export const performAutoSave = async () => {
  try {
    const backupData = await exportDataBackup(true) as string;
    if (backupData) {
      sessionStorage.setItem('autoSaveBackup', backupData);
      sessionStorage.setItem('autoSaveTimestamp', new Date().toISOString());
      return true;
    }
    return false;
  } catch (error) {
    console.error("Auto-save error:", error);
    return false;
  }
};

// Function to check for auto-save and restore if needed
export const checkAndRestoreAutoSave = () => {
  try {
    const autoSaveBackup = sessionStorage.getItem('autoSaveBackup');
    const timestamp = sessionStorage.getItem('autoSaveTimestamp');
    
    if (autoSaveBackup && timestamp) {
      return { 
        available: true, 
        timestamp: new Date(timestamp),
        restore: async () => {
          const success = await importDataBackup(autoSaveBackup);
          if (success) {
            sessionStorage.removeItem('autoSaveBackup');
            sessionStorage.removeItem('autoSaveTimestamp');
          }
          return success;
        }
      };
    }
    
    return { available: false, timestamp: null, restore: null };
  } catch (error) {
    console.error("Auto-restore check error:", error);
    return { available: false, timestamp: null, restore: null };
  }
};
