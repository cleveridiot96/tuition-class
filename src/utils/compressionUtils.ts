
import LZString from 'lz-string';

/**
 * Initialize background compression system
 */
export const initBackgroundCompression = () => {
  console.log('Initializing background compression system...');
  
  // Set up a periodic check for large uncompressed data
  setInterval(() => {
    compressLargeDataItems();
  }, 60000); // Check every minute
};

/**
 * Scan localStorage and compress any large items that aren't already compressed
 */
const compressLargeDataItems = () => {
  const sizeThreshold = 100 * 1024; // 100KB
  const compressionPrefix = 'lz:';
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key);
      if (!value) continue;
      
      // Skip if already compressed
      if (value.startsWith(compressionPrefix)) continue;
      
      // Check if size exceeds threshold
      if (value.length * 2 > sizeThreshold) {
        console.log(`Compressing large item: ${key} (${formatBytes(value.length * 2)})`);
        
        try {
          const compressed = LZString.compress(value);
          localStorage.setItem(key, `${compressionPrefix}${compressed}`);
          console.log(`Compressed ${key}: ${formatBytes(value.length * 2)} → ${formatBytes(compressed.length * 2)}`);
        } catch (compressError) {
          console.error(`Failed to compress ${key}:`, compressError);
        }
      }
    }
  } catch (error) {
    console.error('Error during background compression:', error);
  }
};

/**
 * Format bytes to a human-readable string
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculate and log storage statistics
 */
export const logStorageStats = () => {
  try {
    let totalSize = 0;
    let compressedSize = 0;
    let compressedItems = 0;
    let uncompressedItems = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      const value = localStorage.getItem(key) || '';
      const itemSize = (key.length + value.length) * 2; // Unicode = 2 bytes per char
      totalSize += itemSize;
      
      if (value.startsWith('lz:')) {
        compressedSize += itemSize;
        compressedItems++;
      } else {
        uncompressedItems++;
      }
    }
    
    console.log('=== Storage Statistics ===');
    console.log(`Total Size: ${formatBytes(totalSize)}`);
    console.log(`Compressed Data: ${formatBytes(compressedSize)} (${compressedItems} items)`);
    console.log(`Uncompressed Data: ${formatBytes(totalSize - compressedSize)} (${uncompressedItems} items)`);
    console.log(`Storage Limit: ${formatBytes(5 * 1024 * 1024)}`); // 5MB typical limit
    console.log('========================');
    
    // Check if approaching storage limits
    if (totalSize > 4 * 1024 * 1024) { // 4MB
      console.warn('Storage usage is approaching the browser limit!');
    }
    
    return {
      totalSize,
      compressedSize,
      compressedItems,
      uncompressedItems
    };
  } catch (error) {
    console.error('Error calculating storage stats:', error);
    return null;
  }
};
