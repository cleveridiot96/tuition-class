
import { toast } from "sonner";
import { clearAllData } from './dataClear';
import { seedInitialData } from './seedData';
import { saveStorageItem } from '../storageUtils';
import { exportDataBackup as exportBackup } from './exportBackup';

// Export functions from other files
export { exportDataBackup } from './exportBackup';
export { importDataBackup } from './importBackup';

// Complete format of all data with backup
export const completeFormatAllData = async (): Promise<boolean> => {
  try {
    // Create a backup first
    const backup = await exportBackup(true);
    
    if (!backup) {
      toast.error("Failed to create backup before format");
      return false;
    }
    
    // Save backup timestamp
    saveStorageItem('lastBackupTime', new Date().toISOString());
    
    // Clear all data
    const clearSuccess = clearAllData();
    
    if (!clearSuccess) {
      toast.error("Failed to clear existing data");
      return false;
    }
    
    // Seed initial data
    const seedSuccess = seedInitialData(true);
    
    if (!seedSuccess) {
      toast.error("Failed to seed initial data");
      return false;
    }
    
    toast.success("Format completed successfully");
    return true;
  } catch (error) {
    console.error("Complete format error:", error);
    toast.error("Format operation failed");
    return false;
  }
};

// Re-export necessary functions
export { clearAllData, clearAllMasterData } from './dataClear';
export { seedInitialData } from './seedData';
