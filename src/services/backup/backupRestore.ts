
import { Purchase, Sale, InventoryItem, Payment, Receipt } from '../types';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { getPayments, getReceipts } from '../paymentService';
import { exportDataBackup } from './exportBackup';
import { importDataBackup } from './importBackup';

// Function to clear all data
export const clearAllData = () => {
  try {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Clear all data error:", error);
    return false;
  }
};

// Function to clear all master data
export const clearAllMasterData = () => {
  try {
    localStorage.removeItem('agents');
    localStorage.removeItem('suppliers');
    localStorage.removeItem('customers');
    localStorage.removeItem('brokers');
    localStorage.removeItem('transporters');
    localStorage.removeItem('locations');
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Clear master data error:", error);
    return false;
  }
};

// Function to seed initial data
export const seedInitialData = (force?: boolean) => {
  try {
    if (force || !getStorageItem('locations')) {
      saveStorageItem('locations', ["Mumbai", "Chiplun", "Sawantwadi"]);
    }
    return true;
  } catch (error) {
    console.error("Seed initial data error:", error);
    return false;
  }
};

// Complete format of all data with backup
export const completeFormatAllData = async (): Promise<boolean> => {
  try {
    // Create a backup first
    const backup = exportDataBackup(true);
    
    // If the backup was created successfully, clear all data
    if (backup) {
      // Save backup timestamp
      saveStorageItem('lastBackupTime', new Date().toISOString());
      
      // Create a backup file (in a real app, this would download or store the backup)
      console.log("Data backup created before format");
      
      // Clear all data
      const clearSuccess = clearAllData();
      
      // Seed initial data
      if (clearSuccess) {
        seedInitialData(true);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Complete format error:", error);
    return false;
  }
};
