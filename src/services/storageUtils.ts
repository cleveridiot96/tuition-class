
import { getActiveFinancialYear } from './financialYearService';
import { format, parseISO, addDays } from 'date-fns';

// Helper functions for working with localStorage
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from storage:`, error);
    return defaultValue;
  }
}

export function saveStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving item ${key} to storage:`, error);
  }
}

// Financial year specific storage functions
export function getFinancialYearKeyPrefix(): string {
  const activeYear = getActiveFinancialYear();
  return activeYear ? `fy_${activeYear.id}_` : '';
}

export function getYearSpecificKey(key: string): string {
  const prefix = getFinancialYearKeyPrefix();
  return prefix ? `${prefix}${key}` : key;
}

export function getYearSpecificStorageItem<T>(key: string, defaultValue: T): T {
  const yearKey = getYearSpecificKey(key);
  return getStorageItem(yearKey, defaultValue);
}

export function saveYearSpecificStorageItem<T>(key: string, value: T): void {
  const yearKey = getYearSpecificKey(key);
  saveStorageItem(yearKey, value);
}

// Location management functions
export function getLocations(): string[] {
  return getStorageItem('locations', []);
}

export function saveLocations(locations: string[]): void {
  saveStorageItem('locations', locations);
}

export function addLocation(location: string): void {
  const locations = getLocations();
  if (!locations.includes(location)) {
    locations.push(location);
    saveLocations(locations);
  }
}

// Lot number validation
export function checkDuplicateLot(lotNumber: string): boolean {
  const inventory = getYearSpecificStorageItem('inventory', []);
  return inventory.some((item: any) => 
    item.lotNumber === lotNumber && !item.isDeleted
  );
}

// Storage statistics
export function getStorageSize(): { 
  totalSize: number;
  keyCount: number;
  items: {key: string, size: number}[] 
} {
  const result = {
    totalSize: 0,
    keyCount: 0,
    items: [] as {key: string, size: number}[]
  };
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const size = (key.length + value.length) * 2; // Approx bytes in UTF-16
        
        result.items.push({
          key,
          size
        });
        
        result.totalSize += size;
        result.keyCount++;
      }
    }
    
    // Sort by size, largest first
    result.items.sort((a, b) => b.size - a.size);
    
  } catch (error) {
    console.error("Error calculating storage size:", error);
  }
  
  return result;
}

// Backup and restore
export function exportDataBackup(silent: boolean = false): string {
  try {
    const data: Record<string, any> = {};
    
    // Collect all data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          }
        } catch (error) {
          console.error(`Error parsing item ${key}:`, error);
        }
      }
    }
    
    // Create backup object
    const backup = {
      data,
      timestamp: Date.now()
    };
    
    // Convert to JSON string
    const backupJson = JSON.stringify(backup);
    
    // If not silent mode, trigger download
    if (!silent) {
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const date = format(new Date(), 'yyyy-MM-dd');
      const filename = `kisan-khata-backup-${date}.json`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    return backupJson;
  } catch (error) {
    console.error("Error creating backup:", error);
    return '';
  }
}

export function importDataBackup(backupJson: string): boolean {
  try {
    const backup = JSON.parse(backupJson);
    const { data } = backup;
    
    if (!data) {
      console.error("Invalid backup format: missing data property");
      return false;
    }
    
    // Restore all items to localStorage
    Object.entries(data).forEach(([key, value]) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error restoring item ${key}:`, error);
      }
    });
    
    // Trigger storage event to notify other parts of the app
    window.dispatchEvent(new Event('storage'));
    
    return true;
  } catch (error) {
    console.error("Error importing backup:", error);
    return false;
  }
}

// Clear data functions
export function clearAllData(): void {
  localStorage.clear();
}

export function clearAllMasterData(): void {
  const keysToKeep = new Set(['financialYears', 'activeFinancialYear']);
  
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && !keysToKeep.has(key)) {
      localStorage.removeItem(key);
    }
  }
}

// Initial data seeding
export function seedInitialData(): void {
  // Add default locations if none exist
  if (getLocations().length === 0) {
    saveLocations(['Warehouse A', 'Warehouse B', 'Store Room']);
  }
}
