
import LZString from 'lz-string';
import { getCurrentFinancialYear } from './financialYearService';

/**
 * Helper function to get an item from localStorage with decompression support
 */
export function getStorageItem(key: string, decompress = false) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    
    // Check if data is compressed
    if (decompress && data.startsWith('lz:')) {
      const compressedData = data.substring(3); // Remove 'lz:' prefix
      const decompressedData = LZString.decompress(compressedData);
      return decompressedData ? JSON.parse(decompressedData) : null;
    }
    
    // Regular JSON parsing
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
}

/**
 * Helper function to save an item to localStorage with compression support
 */
export function saveStorageItem(key: string, data: any, compress = false) {
  try {
    if (compress) {
      // Compress the data using LZ-string
      const jsonData = JSON.stringify(data);
      const compressedData = LZString.compress(jsonData);
      localStorage.setItem(key, `lz:${compressedData}`);
    } else {
      // Regular JSON serialization
      localStorage.setItem(key, JSON.stringify(data));
    }
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return false;
  }
}

/**
 * Helper function to remove an item from localStorage
 */
export function removeStorageItem(key: string) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
}

/**
 * Helper function to clear all items from localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
}

/**
 * Calculate the approximate size of localStorage data in bytes
 */
export function getStorageSize(): number {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      totalSize += key.length + value.length;
    }
  }
  return totalSize * 2; // Unicode characters use 2 bytes per character in JS
}

/**
 * Get a year-specific key for storage
 */
export function getYearSpecificKey(baseKey: string, year?: string): string {
  const financialYear = year || getCurrentFinancialYear();
  return `${baseKey}-${financialYear}`;
}

/**
 * Get an item with year-specific key
 */
export function getYearSpecificStorageItem(baseKey: string, year?: string, decompress = false) {
  const key = getYearSpecificKey(baseKey, year);
  return getStorageItem(key, decompress);
}

/**
 * Save an item with year-specific key
 */
export function saveYearSpecificStorageItem(baseKey: string, data: any, year?: string, compress = false) {
  const key = getYearSpecificKey(baseKey, year);
  return saveStorageItem(key, data, compress);
}

/**
 * Get all available locations for inventory
 */
export function getLocations(): string[] {
  const rawLocations = getStorageItem('locations') || [];
  
  // Ensure we always have at least the default locations
  if (!rawLocations.length) {
    const defaultLocations = ['Warehouse', 'Storage', 'Shop', 'Market Yard'];
    saveStorageItem('locations', defaultLocations);
    return defaultLocations;
  }
  
  return rawLocations;
}

/**
 * Save locations
 */
export function saveLocations(locations: string[]): boolean {
  return saveStorageItem('locations', locations);
}

/**
 * Helper function to check for duplicate lot numbers
 */
export function checkDuplicateLot(lotNumber: string): boolean {
  const purchases = getYearSpecificStorageItem('purchases') || [];
  return purchases.some(p => p.lotNumber === lotNumber && !p.isDeleted);
}

/**
 * Export all data as a backup
 */
export function exportDataBackup(): {data: any, timestamp: number} {
  // First decompress any compressed data
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key);
      if (!value || !value.startsWith('lz:')) continue;
      
      try {
        const compressedData = value.substring(3);
        const decompressedData = LZString.decompress(compressedData);
        
        if (decompressedData) {
          localStorage.setItem(key, decompressedData);
        }
      } catch (err) {
        console.error(`Failed to decompress item: ${key}`, err);
      }
    }
  } catch (error) {
    console.error('Error decompressing storage items:', error);
  }
  
  // Now collect all data
  const backup: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            backup[key] = JSON.parse(item);
          } catch {
            backup[key] = item;
          }
        }
      } catch (e) {
        console.error(`Error exporting key ${key}:`, e);
      }
    }
  }
  
  return {
    data: backup,
    timestamp: new Date().getTime()
  };
}

/**
 * Import data from a backup
 */
export function importDataBackup(backup: {data: Record<string, any>, timestamp: number}): boolean {
  try {
    clearStorage();
    
    const keys = Object.keys(backup.data);
    for (const key of keys) {
      try {
        const value = backup.data[key];
        if (value !== null && value !== undefined) {
          saveStorageItem(key, value);
        }
      } catch (e) {
        console.error(`Error importing key ${key}:`, e);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data backup:', error);
    return false;
  }
}

/**
 * Clear all data except settings
 */
export function clearAllData(): boolean {
  try {
    const settingsToPreserve = [
      'theme',
      'font-size',
      'user-preferences',
    ];
    
    // Store settings that should be preserved
    const preserved: Record<string, string | null> = {};
    for (const key of settingsToPreserve) {
      preserved[key] = localStorage.getItem(key);
    }
    
    // Clear everything
    localStorage.clear();
    
    // Restore preserved settings
    for (const key of settingsToPreserve) {
      if (preserved[key] !== null) {
        localStorage.setItem(key, preserved[key]!);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

/**
 * Clear all master data but keep transactions
 */
export function clearAllMasterData(): boolean {
  try {
    const keysToRemove = [
      'agents',
      'suppliers',
      'customers',
      'brokers',
      'transporters',
      'locations'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing master data:', error);
    return false;
  }
}

/**
 * Seed initial demo data
 */
export function seedInitialData(): boolean {
  try {
    // Add default locations if they don't exist
    if (!getStorageItem('locations')) {
      saveStorageItem('locations', [
        'Warehouse', 'Storage', 'Shop', 'Market Yard', 'Cold Storage'
      ]);
    }
    
    // Initialize financial years if they don't exist
    if (!getStorageItem('financial-years')) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const startYear = currentDate.getMonth() >= 3 ? year : year - 1; // April onward is new year
      
      saveStorageItem('financial-years', [{
        id: `fy-${startYear}-${startYear + 1}`,
        name: `${startYear}-${(startYear + 1).toString().slice(-2)}`,
        startDate: `${startYear}-04-01`,
        endDate: `${startYear + 1}-03-31`,
        isActive: true
      }]);
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return false;
  }
}

/**
 * Create a financial year key prefix for storage
 */
export function getFinancialYearKeyPrefix(year?: string): string {
  const financialYear = year || getCurrentFinancialYear();
  return `fy-${financialYear}`;
}
