
import { v4 as uuidv4 } from 'uuid';
import { getCurrentFinancialYear } from './financialYearService';
import { BackupData } from './types';

// Get financial year key prefix
export const getFinancialYearKeyPrefix = (yearName: string): string => {
  return `fy_${yearName}_`;
};

// Base storage functions
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function saveStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to localStorage:`, error);
  }
}

// Year-specific storage functions
export function getYearSpecificStorageItem<T>(key: string, defaultValue: T, year?: string): T {
  const currentYear = year || getCurrentFinancialYear();
  const yearKey = getFinancialYearKeyPrefix(currentYear) + key;
  return getStorageItem<T>(yearKey, defaultValue);
}

export function saveYearSpecificStorageItem<T>(key: string, value: T, year?: string, merge = false): void {
  const currentYear = year || getCurrentFinancialYear();
  const yearKey = getFinancialYearKeyPrefix(currentYear) + key;
  
  if (merge && Array.isArray(value)) {
    const existingData = getStorageItem<T[]>(yearKey, [] as unknown as T[]);
    const mergedData = [...existingData, ...value];
    saveStorageItem(yearKey, mergedData);
  } else {
    saveStorageItem(yearKey, value);
  }
}

// Data backup functions
export function exportDataBackup(silent = false): string {
  try {
    const data: Record<string, any> = {};
    
    // Collect all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          }
        } catch (e) {
          // Skip items that can't be parsed as JSON
          console.warn(`Skipping ${key} in backup (not valid JSON)`);
        }
      }
    }
    
    const backup: BackupData = {
      data,
      timestamp: Date.now()
    };
    
    const json = JSON.stringify(backup);
    
    if (!silent) {
      // Create and download file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kisan-khata-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    return json;
  } catch (error) {
    console.error("Error creating backup:", error);
    return "";
  }
}

export function importDataBackup(backupData: string): boolean {
  try {
    const backup = JSON.parse(backupData) as BackupData;
    
    // Validate backup format
    if (!backup || !backup.data || !backup.timestamp) {
      throw new Error("Invalid backup format");
    }
    
    // Create backup of current data before importing
    exportDataBackup(true);
    
    // Clear current data (except for specific items if needed)
    const keysToPreserve: string[] = []; // Add keys to preserve here if needed
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    }
    
    // Import data from backup
    for (const key in backup.data) {
      saveStorageItem(key, backup.data[key]);
    }
    
    return true;
  } catch (error) {
    console.error("Error importing backup:", error);
    return false;
  }
}

// Utility function to check for duplicate lot numbers
export function checkDuplicateLot(lotNumber: string): boolean {
  const currentYear = getCurrentFinancialYear();
  const purchases = getYearSpecificStorageItem('purchases', [], currentYear);
  
  return purchases.some((p: any) => p.lotNumber === lotNumber && !p.isDeleted);
}

// Storage cleanup functions
export function clearAllData(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
}

export function clearAllMasterData(): boolean {
  try {
    const keysToRemove = [
      'suppliers', 'agents', 'brokers', 'customers', 'transporters',
      'locations', 'financialYears', 'activeFinancialYear', 'openingBalances'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Also remove year-specific data prefixed with fy_
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fy_')) {
        localStorage.removeItem(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error clearing master data:", error);
    return false;
  }
}

// Initial data seeding
export function seedInitialData(force = false): void {
  // Set up default locations if not exist
  const locations = getStorageItem<string[]>('locations', []);
  if (locations.length === 0 || force) {
    saveStorageItem('locations', [
      'Warehouse A', 'Warehouse B', 'Godown 1', 'Godown 2', 
      'Shop', 'Market Yard', 'Cold Storage'
    ]);
  }
}

// Get and save locations
export function getLocations(): string[] {
  return getStorageItem<string[]>('locations', []);
}

export function saveLocations(locations: string[]): void {
  saveStorageItem('locations', locations);
}
