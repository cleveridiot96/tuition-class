
import { compress, decompress } from 'lz-string';

/**
 * Storage utility functions with compression for better performance with large datasets
 */

// Get year-specific storage key
export const getYearSpecificKey = (key: string): string => {
  const currentYear = localStorage.getItem('currentFinancialYear') || new Date().getFullYear().toString();
  return `${key}_${currentYear}`;
};

// Get year-specific storage item with automatic decompression
export const getYearSpecificStorageItem = <T>(key: string, defaultValue: T[] = [] as T[]): T[] => {
  try {
    const yearSpecificKey = getYearSpecificKey(key);
    const compressedData = localStorage.getItem(yearSpecificKey);
    
    if (compressedData) {
      // Check if data is compressed (starts with a specific pattern)
      if (compressedData.startsWith('lz:')) {
        const decompressedData = decompress(compressedData.substring(3));
        return decompressedData ? JSON.parse(decompressedData) : defaultValue;
      } else {
        // Legacy data - not compressed
        return JSON.parse(compressedData) || defaultValue;
      }
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return defaultValue;
  }
};

// Save year-specific storage item with compression
export const saveYearSpecificStorageItem = <T>(key: string, data: T[]): void => {
  try {
    const yearSpecificKey = getYearSpecificKey(key);
    
    // Only compress if data is substantial
    if (JSON.stringify(data).length > 1024) {
      const compressedData = compress(JSON.stringify(data));
      localStorage.setItem(yearSpecificKey, `lz:${compressedData}`);
    } else {
      // Don't compress small data to avoid overhead
      localStorage.setItem(yearSpecificKey, JSON.stringify(data));
    }
    
    // Trigger data saved event for portable app
    window.dispatchEvent(new CustomEvent('data-saved', { 
      detail: { key: yearSpecificKey }
    }));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Get storage size info
export const getStorageInfo = () => {
  try {
    let totalSize = 0;
    let compressedSize = 0;
    const items: {key: string, size: number, compressed: boolean}[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const isCompressed = value.startsWith('lz:');
        const size = new Blob([value]).size;
        
        totalSize += size;
        if (isCompressed) compressedSize += size;
        
        items.push({
          key,
          size,
          compressed: isCompressed
        });
      }
    }
    
    return {
      totalSize,
      compressedSize,
      compressionRatio: totalSize > 0 ? (compressedSize / totalSize) : 0,
      items: items.sort((a, b) => b.size - a.size)
    };
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return {
      totalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      items: []
    };
  }
};
