import { debugStorage } from '../storageService';
import { createCompleteBackup } from './backupService';

export const exportDataBackup = async (filename: string, isCompleteBackup: boolean = false) => {
  try {
    const storageData = debugStorage.getAllData();
    
    if (isCompleteBackup) {
      // Perform a complete backup using the existing service
      return await createCompleteBackup(filename);
    }
    
    const dataStr = JSON.stringify(storageData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = filename || `backup-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error("Backup export failed:", error);
    throw error;
  }
};

export const importDataBackup = async (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Invalid file format');
        }
        
        const data = JSON.parse(result);
        
        // Clear existing localStorage
        localStorage.clear();
        
        // Restore data from backup
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        
        resolve(true);
      } catch (error) {
        console.error("Backup import failed:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

export const completeFormatAllData = async (): Promise<boolean> => {
  try {
    // Clear all data from localStorage
    localStorage.clear();
    
    // Initialize with empty arrays for critical data structures
    localStorage.setItem('inventory', JSON.stringify([]));
    localStorage.setItem('purchases', JSON.stringify([]));
    localStorage.setItem('sales', JSON.stringify([]));
    localStorage.setItem('payments', JSON.stringify([]));
    localStorage.setItem('receipts', JSON.stringify([]));
    localStorage.setItem('agents', JSON.stringify([]));
    localStorage.setItem('brokers', JSON.stringify([]));
    localStorage.setItem('customers', JSON.stringify([]));
    localStorage.setItem('suppliers', JSON.stringify([]));
    localStorage.setItem('transporters', JSON.stringify([]));
    localStorage.setItem('masters', JSON.stringify([]));
    
    // Set default locations
    localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
    
    return true;
  } catch (error) {
    console.error("Format operation failed:", error);
    return false;
  }
};
