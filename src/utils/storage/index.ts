
export * from './usbDetection';

// Helper functions for debugging storage operations
export const debugStorageOperations = {
  getItem: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      console.log(`Retrieved ${key} from localStorage:`, value ? JSON.parse(value) : null);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      console.log(`Saved ${key} to localStorage:`, value);
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  }
};
