
import { useState } from 'react';
import { toast } from "sonner";
import { 
  debugStorage, 
  clearAllData, 
  exportDataBackup, 
  importDataBackup,
} from '@/services/storageService';

export interface StorageStats {
  [key: string]: number;
}

export const useStorageDebug = () => {
  const [storageData, setStorageData] = useState<string>('');
  const [importData, setImportData] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showBackupConfirm, setShowBackupConfirm] = useState<boolean>(false);
  const [storageStats, setStorageStats] = useState<StorageStats>({});

  const handleDebugClick = () => {
    try {
      console.log("Debugging storage...");
      debugStorage();
      
      const allData: Record<string, any> = {};
      const stats: StorageStats = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || 'null');
            allData[key] = data;
            
            if (Array.isArray(data)) {
              stats[key] = data.length;
            } else if (typeof data === 'object' && data !== null) {
              stats[key] = Object.keys(data).length;
            } else {
              stats[key] = 1;
            }
          } catch (e) {
            allData[key] = localStorage.getItem(key);
            stats[key] = 1;
          }
        }
      }
      
      setStorageStats(stats);
      setStorageData(JSON.stringify(allData, null, 2));
    } catch (error) {
      console.error('Error debugging storage:', error);
      toast.error("Error accessing storage data");
    }
  };

  const getTotalEntries = (): number => {
    return Object.values(storageStats).reduce((sum, count) => sum + count, 0);
  };

  return {
    storageData,
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
    getTotalEntries,
  };
};
