
import { getYearSpecificKey } from '@/services/financialYearService';
import { getStorageItem, saveStorageItem, removeStorageItem } from './storageCore';

export const getYearSpecificStorageItem = <T>(key: string): T => {
  const yearSpecificKey = getYearSpecificKey(key);
  return getStorageItem<T>(yearSpecificKey) || ([] as unknown as T);
};

export const saveYearSpecificStorageItem = <T>(key: string, value: T): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  saveStorageItem<T>(yearSpecificKey, value);
};

export const removeYearSpecificStorageItem = (key: string): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  removeStorageItem(yearSpecificKey);
};
