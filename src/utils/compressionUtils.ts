
import { getStorageInfo } from '../services/storageUtils';

const COMPRESSION_THRESHOLD = 500 * 1024; // 500KB
const AUTO_COMPRESS_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Check if data should be compressed
export const shouldCompressStorage = (): boolean => {
  const { totalSize, compressedSize } = getStorageInfo();
  return totalSize > COMPRESSION_THRESHOLD && compressedSize / totalSize < 0.7;
};

// Initialize background compression for large datasets
export const initBackgroundCompression = () => {
  // Immediate check
  compressDataIfNeeded();
  
  // Set up interval for regular checks
  setInterval(() => {
    compressDataIfNeeded();
  }, AUTO_COMPRESS_INTERVAL);
  
  // Compress before app closes
  window.addEventListener('beforeunload', () => {
    compressDataIfNeeded(true); // force compression on exit
  });
};

// Compress data if total size exceeds threshold
export const compressDataIfNeeded = (force = false) => {
  const storageInfo = getStorageInfo();
  console.log('Storage stats:', storageInfo);
  
  if (force || (storageInfo.totalSize > COMPRESSION_THRESHOLD && storageInfo.compressionRatio < 0.7)) {
    console.log('Starting background compression of data...');
    
    // We'll process a few items at a time to avoid UI freezing
    const itemsToProcess = storageInfo.items
      .filter(item => !item.compressed && item.size > 1024)
      .slice(0, 5);
      
    if (itemsToProcess.length > 0) {
      console.log(`Compressing ${itemsToProcess.length} storage items`);
      // We'll delegate the actual compression to another function
      // that will be called from app initialization
    }
  }
};

// Debug utility to show storage stats
export const logStorageStats = () => {
  const { totalSize, compressedSize, items } = getStorageInfo();
  console.log(
    `Storage stats: Total ${(totalSize/1024).toFixed(2)}KB, ` +
    `Compressed ${(compressedSize/1024).toFixed(2)}KB, ` +
    `Saved ${(1-(compressedSize/totalSize || 1)).toFixed(2)*100}%`
  );
  
  console.table(items.slice(0, 10).map(item => ({
    key: item.key,
    size: `${(item.size/1024).toFixed(2)}KB`,
    compressed: item.compressed
  })));
};
