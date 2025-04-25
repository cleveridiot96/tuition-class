
import { exportDataBackup, importDataBackup } from '../backup/backupRestore';
import { seedInitialData } from '../backup/backupRestore';

// Function to properly reset all data including receipts
export const completeFormatAllData = async () => {
  try {
    // First create a backup
    const backupData = await exportDataBackup(true) as string;
    
    // Save backup to localStorage before formatting
    if (backupData) {
      localStorage.setItem('preFormatBackup', backupData);
    }
    
    // Clear ALL localStorage completely
    localStorage.clear();
    
    // Small delay to ensure clearing is complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Re-initialize with fresh data
    seedInitialData(true);
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage'));
    
    return true;
  } catch (error) {
    console.error("Complete format error:", error);
    return false;
  }
};

// Function to attempt data recovery in case of crash
export const attemptDataRecovery = () => {
  try {
    // Check for pre-format backup
    const preFormatBackup = localStorage.getItem('preFormatBackup');
    if (preFormatBackup) {
      return { 
        available: true, 
        restore: () => importDataBackup(preFormatBackup) 
      };
    }
    
    return { available: false, restore: null };
  } catch (error) {
    console.error("Error checking for recovery data:", error);
    return { available: false, restore: null };
  }
};
