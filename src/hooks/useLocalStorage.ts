
import { useState, useEffect } from 'react';

const readValue = <T>(key: string, initialValue: T): T => {
  // Check if we're running in a browser environment
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return initialValue;
    }
    
    try {
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return readValue(key, initialValue);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
