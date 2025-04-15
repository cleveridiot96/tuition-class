import { getYearSpecificKey } from '@/services/financialYearService';

export const getStorageItem = <T>(key: string): T | null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error("Error getting item from localStorage:", error);
    return null;
  }
};

export const saveStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving item to localStorage:", error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item from localStorage:", error);
  }
};

export const getYearSpecificStorageItem = <T>(key: string): T | null => {
  const yearSpecificKey = getYearSpecificKey(key);
  return getStorageItem<T>(yearSpecificKey);
};

export const saveYearSpecificStorageItem = <T>(key: string, value: T): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  saveStorageItem<T>(yearSpecificKey, value);
};

export const removeYearSpecificStorageItem = (key: string): void => {
  const yearSpecificKey = getYearSpecificKey(key);
  removeStorageItem(yearSpecificKey);
};
