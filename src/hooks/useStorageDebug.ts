
import { useState, useEffect } from 'react';
import { debugStorage } from '@/services/storageService';

export const useStorageDebug = () => {
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Use the debugStorage object's methods directly, not calling the object itself
    const data = debugStorage.getAllData();
    setStorageData(data);
  }, []);
  
  const refreshData = () => {
    const data = debugStorage.getAllData();
    setStorageData(data);
  };
  
  const getItemData = (key: string) => {
    // Use the debugStorage object's getItem method
    return debugStorage.getItem(key);
  };
  
  return {
    storageData,
    refreshData,
    getItemData
  };
};
