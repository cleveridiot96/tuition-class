
import { getYearSpecificKey } from '@/services/financialYearService';

// LocalStorage Operations
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return null;
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error("Error getting item from localStorage:", error);
    return null;
  }
};

export const saveStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving item to localStorage:", error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from localStorage:", error);
  }
};

// Year-specific operations
export const getYearSpecificStorageItem = <T>(key: string): T => {
  const yearSpecificKey = getYearSpecificKey(key);
  return getStorageItem<T>(yearSpecificKey) || ([] as unknown as T);
};

export const saveYearSpecificStorageItem = <T>(key: string, value: T): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  saveStorageItem<T>(yearSpecificKey, value);
};

export const removeYearSpecificStorageItem = (key: string): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  removeStorageItem(yearSpecificKey);
};

// Backup operations
export const exportDataBackup = (silent: boolean = false): string | null => {
  try {
    const data: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    
    const jsonData = JSON.stringify(data, null, 2);
    if (!silent) console.log("Data backup created successfully");
    return jsonData;
  } catch (error) {
    console.error("Error creating data backup:", error);
    return null;
  }
};

export const importDataBackup = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (typeof data !== 'object' || data === null) {
      console.error("Invalid backup format: Data is not an object");
      return false;
    }

    const requiredKeys = ['locations', 'currentFinancialYear'];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    
    if (missingKeys.length > 0) {
      console.error(`Backup is missing required keys: ${missingKeys.join(', ')}`);
      return false;
    }
    
    localStorage.clear();
    
    let importedKeyCount = 0;
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        try {
          localStorage.setItem(key, JSON.stringify(data[key]));
          importedKeyCount++;
        } catch (e) {
          console.error(`Error importing key ${key}:`, e);
        }
      }
    }
    
    console.log(`Data imported successfully: ${importedKeyCount} keys restored`);
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// Data clearing operations
export const clearAllData = (): void => {
  try {
    const currentYear = localStorage.getItem('currentFinancialYear');
    const currentLocations = localStorage.getItem('locations');
    
    localStorage.clear();
    
    if (currentYear) localStorage.setItem('currentFinancialYear', currentYear);
    if (currentLocations) localStorage.setItem('locations', currentLocations);
    
    console.log("All transaction data cleared");
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

export const clearAllMasterData = (): void => {
  try {
    const masterKeys = ['agents', 'customers', 'suppliers', 'brokers', 'transporters'];
    masterKeys.forEach(key => localStorage.removeItem(key));
    console.log("All master data cleared");
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error clearing master data:", error);
  }
};

// Data initialization
export const seedInitialData = (silent: boolean = false): void => {
  try {
    if (!localStorage.getItem('locations')) {
      localStorage.setItem('locations', JSON.stringify(["Mumbai", "Chiplun", "Sawantwadi"]));
    }
    
    const dataTypes = [
      'agents', 'customers', 'suppliers', 'brokers', 'transporters',
      'inventory', 'purchases', 'sales', 'payments', 'receipts'
    ];
    
    dataTypes.forEach(type => {
      if (!localStorage.getItem(type)) {
        localStorage.setItem(type, JSON.stringify([]));
      }
    });
    
    const yearSpecificTypes = ['inventory', 'purchases', 'sales', 'payments', 'receipts'];
    const currentYear = localStorage.getItem('currentFinancialYear');
    
    if (currentYear) {
      yearSpecificTypes.forEach(type => {
        const yearKey = `${type}_${currentYear}`;
        if (!localStorage.getItem(yearKey)) {
          localStorage.setItem(yearKey, JSON.stringify([]));
        }
      });
    }
    
    if (!silent) console.log("Initial data seeded successfully");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};

// Helper functions
export const getLocations = (): string[] => {
  try {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : ["Mumbai", "Chiplun", "Sawantwadi"];
  } catch (error) {
    console.error("Error getting locations:", error);
    return ["Mumbai", "Chiplun", "Sawantwadi"];
  }
};

export const checkDuplicateLot = (lotNumber: string): boolean => {
  try {
    const purchases = getYearSpecificStorageItem<any[]>('purchases') || [];
    return purchases.some((p: any) => p.lotNumber === lotNumber && !p.isDeleted);
  } catch (error) {
    console.error("Error checking duplicate lot:", error);
    return false;
  }
};

export const getAgents = () => {
  const agents = getStorageItem<any[]>('agents');
  if (!agents) {
    console.warn("No agents found in storage, returning empty array");
    return [];
  }
  return agents;
};

// Debug function - THIS WAS MISSING EXPORT
export const debugStorage = (key: string = ''): void => {
  try {
    if (key) {
      const value = localStorage.getItem(key);
      console.log(`Storage Debug - Key: ${key}`, value ? JSON.parse(value) : null);
    } else {
      console.log('Storage Debug - All Keys:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            console.log(`- ${key}:`, JSON.parse(localStorage.getItem(key) || "null"));
          } catch (e) {
            console.log(`- ${key} (raw):`, localStorage.getItem(key));
          }
        }
      }
    }
  } catch (error) {
    console.error("Error debugging storage:", error);
  }
};
