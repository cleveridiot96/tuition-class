
import { useState, useEffect, useCallback } from 'react';
import { debugStorage } from '@/services/storageService';

// Define type for storage statistics
export interface StorageStats {
  totalItems: number;
  totalSize: number;
  largestItems: Array<{key: string, size: number}>;
}

export const useStorageDebug = () => {
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  const [importData, setImportData] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'master' | 'transaction' | 'settings'>('all');
  const [showBackupConfirm, setShowBackupConfirm] = useState<boolean>(false);
  const [storageStats, setStorageStats] = useState<StorageStats>({
    totalItems: 0,
    totalSize: 0,
    largestItems: []
  });
  
  const handleDebugClick = useCallback(() => {
    // Use the debugStorage object's methods directly
    const data = debugStorage.getAllData();
    setStorageData(data);
    calculateStorageStats(data);
  }, []);

  const calculateStorageStats = (data: Record<string, any>) => {
    try {
      const itemSizes: Array<{key: string, size: number}> = [];
      let totalSize = 0;
      
      Object.entries(data).forEach(([key, value]) => {
        const serialized = JSON.stringify(value);
        const size = serialized ? serialized.length : 0;
        totalSize += size;
        itemSizes.push({ key, size });
      });
      
      // Sort by size (descending)
      itemSizes.sort((a, b) => b.size - a.size);
      
      setStorageStats({
        totalItems: Object.keys(data).length,
        totalSize,
        largestItems: itemSizes.slice(0, 5) // Top 5 largest items
      });
    } catch (error) {
      console.error("Error calculating storage stats:", error);
    }
  };
  
  useEffect(() => {
    handleDebugClick();
  }, [handleDebugClick]);
  
  const refreshData = () => {
    const data = debugStorage.getAllData();
    setStorageData(data);
    calculateStorageStats(data);
  };
  
  const getItemData = (key: string) => {
    return debugStorage.getItem(key);
  };

  const getTotalEntries = () => {
    return Object.keys(storageData).length;
  };
  
  return {
    storageData,
    refreshData,
    getItemData,
    importData,
    setImportData,
    searchTerm, 
    setSearchTerm,
    filterType,
    setFilterType,
    showBackupConfirm,
    setShowBackupConfirm,
    storageStats,
    handleDebugClick,
    getTotalEntries
  };
};
