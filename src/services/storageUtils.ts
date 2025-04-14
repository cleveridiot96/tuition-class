
import LZString from 'lz-string';

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
