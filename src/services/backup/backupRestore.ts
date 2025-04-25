
import { debugStorage } from '../storageService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Exports data backup with options for filename and complete backup
 * @param filenameOrOptions Filename or boolean for complete backup
 * @param isCompleteBackup Whether to create a complete backup
 * @returns The backup data as a string or boolean status
 */
export const exportDataBackup = async (filenameOrOptions?: string | boolean, isCompleteBackup: boolean = false): Promise<string | boolean> => {
  try {
    // Handle case where first parameter is a boolean (backwards compatibility)
    if (typeof filenameOrOptions === 'boolean') {
      isCompleteBackup = filenameOrOptions;
      filenameOrOptions = undefined;
    }

    const filename = typeof filenameOrOptions === 'string' ? filenameOrOptions : undefined;
    const storageData = debugStorage.getAllData();
    
    // Always return the data string when silent/complete backup is requested
    if (isCompleteBackup) {
      const dataStr = JSON.stringify(storageData);
      
      // If filename is provided, also trigger download
      if (filename) {
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        const exportFileDefaultName = filename || `backup-${new Date().toISOString()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
      
      return dataStr;
    }
    
    // Regular export with download
    const dataStr = JSON.stringify(storageData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = filename || `backup-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return dataStr;
  } catch (error) {
    console.error("Backup export failed:", error);
    throw error;
  }
};

/**
 * Imports data backup from file or string
 * @param fileOrData The file or string data to import
 * @returns Promise resolving to boolean success status
 */
export const importDataBackup = async (fileOrData: File | string): Promise<boolean> => {
  // Handle string data directly
  if (typeof fileOrData === 'string') {
    try {
      const data = JSON.parse(fileOrData);
      
      // Clear existing localStorage
      localStorage.clear();
      
      // Restore data from backup
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      return true;
    } catch (error) {
      console.error("Backup import from string failed:", error);
      return false;
    }
  }
  
  // Handle File object
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
    
    reader.readAsText(fileOrData);
  });
};

// Core data management functions
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

export const clearAllMasterData = () => {
  try {
    const masterKeys = [
      'agents',
      'suppliers',
      'customers', 
      'brokers',
      'transporters',
      'locations'
    ];
    
    masterKeys.forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Clear master data error:", error);
    return false;
  }
};

export const seedInitialData = (force?: boolean) => {
  try {
    if (force || !localStorage.getItem('locations')) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    return true;
  } catch (error) {
    console.error("Seed initial data error:", error);
    return false;
  }
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

// Function to create a complete backup as a ZIP file
export const createCompleteBackup = async (filename?: string): Promise<string | boolean> => {
  try {
    const backupData = await exportDataBackup(true) as string;
    
    if (!backupData) {
      return false;
    }
    
    // Create zip file
    const zip = new JSZip();
    zip.file("data.json", backupData);
    
    const content = await zip.generateAsync({ type: "blob" });
    const exportName = filename || `backup-${new Date().toISOString()}.zip`;
    
    saveAs(content, exportName);
    return backupData;
  } catch (error) {
    console.error("Complete backup creation failed:", error);
    return false;
  }
};
