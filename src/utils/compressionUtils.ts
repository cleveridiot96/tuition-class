
import LZString from 'lz-string';
import { getStorageSize, getStorageItem, saveStorageItem } from '@/services/storageUtils';
import { toast } from '@/components/ui/use-toast';

// Compression threshold in bytes (5MB)
const COMPRESSION_THRESHOLD = 5 * 1024 * 1024;

// Keys that should always be kept uncompressed for performance
const ALWAYS_UNCOMPRESSED_KEYS = [
  'theme',
  'font-size',
  'financial-years',
  'active-financial-year',
  'user-preferences'
];

/**
 * Initialize background compression system
 */
export function initBackgroundCompression() {
  console.log('Initializing background compression system');
  
  // Perform initial compression check
  checkAndCompressLargeData();
  
  // Set up periodic compression check
  setInterval(checkAndCompressLargeData, 15 * 60 * 1000); // Every 15 minutes
}

/**
 * Check storage size and compress data if needed
 */
function checkAndCompressLargeData() {
  try {
    const currentSize = getStorageSize();
    console.log(`Current localStorage size: ${(currentSize / 1024).toFixed(2)} KB`);
    
    // If storage size exceeds threshold, compress large items
    if (currentSize > COMPRESSION_THRESHOLD) {
      console.log('Storage size exceeds threshold, compressing large data items...');
      compressLargeItems();
    }
  } catch (error) {
    console.error('Error in compression check:', error);
  }
}

/**
 * Compress large items in localStorage
 */
function compressLargeItems() {
  try {
    let itemsCompressed = 0;
    let bytesReclaimed = 0;
    const startSize = getStorageSize();
    
    // Iterate through all localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Skip already compressed items or items in the exclusion list
      if (key.startsWith('lz:') || ALWAYS_UNCOMPRESSED_KEYS.includes(key)) {
        continue;
      }
      
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Only compress items larger than 10KB
      if (value.length > 10 * 1024) {
        const originalSize = value.length * 2; // UTF-16 characters
        const compressedValue = `lz:${LZString.compress(value)}`;
        localStorage.setItem(key, compressedValue);
        
        const newSize = compressedValue.length * 2; // UTF-16 characters
        const reclaimed = originalSize - newSize;
        
        if (reclaimed > 0) {
          bytesReclaimed += reclaimed;
          itemsCompressed++;
          console.log(`Compressed item: ${key}, saved ${(reclaimed / 1024).toFixed(2)} KB`);
        } else {
          // If compression didn't save space, revert
          localStorage.setItem(key, value);
        }
      }
    }
    
    const endSize = getStorageSize();
    const percentReduced = startSize > 0 ? ((startSize - endSize) / startSize) * 100 : 0;
    
    console.log(`Compression complete: ${itemsCompressed} items compressed`);
    console.log(`Storage reduced from ${(startSize / 1024).toFixed(2)} KB to ${(endSize / 1024).toFixed(2)} KB (${percentReduced.toFixed(1)}%)`);
    
    if (itemsCompressed > 0) {
      toast({
        title: "Storage optimized",
        description: `${itemsCompressed} data items compressed, saving ${(bytesReclaimed / 1024).toFixed(1)} KB`,
        duration: 3000
      });
    }
  } catch (error) {
    console.error('Error compressing items:', error);
  }
}

/**
 * Log current storage statistics
 */
export function logStorageStats() {
  const currentSize = getStorageSize();
  const compressedItems = [...Array(localStorage.length)]
    .map((_, i) => localStorage.key(i))
    .filter(key => key && key.startsWith('lz:'))
    .length;
  
  console.log('Storage Stats:');
  console.log(`- Current size: ${(currentSize / 1024).toFixed(2)} KB`);
  console.log(`- Compressed items: ${compressedItems}`);
  console.log(`- Total items: ${localStorage.length}`);
  
  // Check browser storage limits
  const quota = navigator.storage && navigator.storage.estimate ? 
    navigator.storage.estimate().then(estimate => {
      const percentUsed = estimate.usage && estimate.quota ? 
        (estimate.usage / estimate.quota) * 100 : null;
      
      console.log(`- Browser quota: ${estimate.quota ? (estimate.quota / (1024 * 1024)).toFixed(2) + ' MB' : 'unknown'}`);
      console.log(`- Usage: ${estimate.usage ? (estimate.usage / (1024 * 1024)).toFixed(2) + ' MB' : 'unknown'}`);
      console.log(`- Percent used: ${percentUsed ? percentUsed.toFixed(1) + '%' : 'unknown'}`);
      
      // Warn if approaching quota
      if (percentUsed && percentUsed > 80) {
        console.warn(`WARNING: Storage usage is high (${percentUsed.toFixed(1)}% of quota)`);
        toast({
          title: "Storage warning",
          description: `Your browser storage is ${percentUsed.toFixed(0)}% full. Consider backing up your data.`,
          variant: "destructive",
          duration: 6000
        });
      }
    }) : 
    Promise.resolve(console.log('- Storage quota information not available'));
  
  return {
    size: currentSize,
    compressedItems,
    totalItems: localStorage.length
  };
}

/**
 * Export the current compression stats
 */
export function getCompressionStats() {
  const totalItems = localStorage.length;
  const compressedItems = [...Array(totalItems)]
    .map((_, i) => localStorage.key(i))
    .filter(key => key && key.startsWith('lz:'))
    .length;
  
  return {
    totalSize: getStorageSize(),
    totalItems,
    compressedItems,
    compressionRatio: compressedItems / totalItems
  };
}

/**
 * Force compression of all suitable data
 */
export function forceCompressAll() {
  compressLargeItems();
}

/**
 * Decompress all items (useful before backup)
 */
export function decompressAll() {
  try {
    let itemsDecompressed = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('lz:')) continue;
      
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      try {
        const originalKey = key.substring(3); // Remove 'lz:' prefix
        const decompressedValue = LZString.decompress(value);
        
        if (decompressedValue) {
          localStorage.removeItem(key);
          localStorage.setItem(originalKey, decompressedValue);
          itemsDecompressed++;
        }
      } catch (err) {
        console.error(`Failed to decompress item: ${key}`, err);
      }
    }
    
    console.log(`Decompressed ${itemsDecompressed} items`);
    return itemsDecompressed;
  } catch (error) {
    console.error('Error decompressing items:', error);
    return 0;
  }
}
