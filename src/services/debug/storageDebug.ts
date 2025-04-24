
/**
 * Debug utilities for local storage
 */

// Function to debug storage contents
export const debugStorage = (): Record<string, any> => {
  try {
    const storage: Record<string, any> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          storage[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          storage[key] = localStorage.getItem(key);
        }
      }
    }
    
    console.log('Storage debug content:', storage);
    return storage;
  } catch (error) {
    console.error('Error debugging storage:', error);
    return {};
  }
};

// Function to get total storage usage
export const getStorageStats = (): { usage: number; limit: number; percent: number } => {
  try {
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to KB
    const usageKB = Math.round(totalSize / 1024);
    
    // Typical limit is around 5MB for most browsers
    const limitKB = 5 * 1024;
    
    return {
      usage: usageKB,
      limit: limitKB,
      percent: Math.round((usageKB / limitKB) * 100)
    };
  } catch (error) {
    console.error('Error calculating storage stats:', error);
    return {
      usage: 0,
      limit: 5 * 1024,
      percent: 0
    };
  }
};
