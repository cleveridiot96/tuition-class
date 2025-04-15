
import * as pako from 'pako';
import { getStorageItem, saveStorageItem } from '@/services/storageUtils';

// Calculate the total size of localStorage
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

// Log storage statistics to console
export function logStorageStats(): void {
  const stats = getStorageSize();
  
  console.group('Storage Statistics');
  console.log(`Total keys: ${stats.keyCount}`);
  console.log(`Total size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
  
  if (stats.items.length > 0) {
    console.log('--- Largest items ---');
    stats.items.slice(0, 5).forEach(item => {
      console.log(`${item.key}: ${(item.size / 1024).toFixed(2)} KB`);
    });
  }
  
  console.groupEnd();
}

// Function to compress string data
export function compressData(data: string): Uint8Array {
  try {
    const compressed = pako.deflate(data);
    return compressed;
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
}

// Function to decompress data
export function decompressData(compressed: Uint8Array): string {
  try {
    const decompressed = pako.inflate(compressed);
    return new TextDecoder().decode(decompressed);
  } catch (error) {
    console.error("Decompression error:", error);
    throw error;
  }
}

// Initialize background compression
export function initBackgroundCompression(): void {
  console.log("Background compression system initialized");
  
  // Compress large items in localStorage
  const compressLargeItems = () => {
    const stats = getStorageSize();
    const largeItems = stats.items.filter(item => item.size > 50 * 1024); // Items larger than 50 KB
    
    if (largeItems.length > 0) {
      console.log(`Found ${largeItems.length} large items for compression`);
      // Implement compression logic here if needed
    }
  };
  
  // Run once on startup
  setTimeout(() => {
    compressLargeItems();
  }, 5000);
  
  // Run periodically
  setInterval(() => {
    compressLargeItems();
  }, 60 * 60 * 1000); // Every hour
}
