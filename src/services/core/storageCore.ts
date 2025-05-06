
// Core storage operations
export const getStorageItem = <T>(key: string): T => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      // Return empty array for array types, empty object otherwise
      return ([] as unknown) as T;
    }
    return JSON.parse(serializedState) as T;
  } catch (error) {
    console.error("Error getting item from localStorage:", error);
    return ([] as unknown) as T;
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

// Helper functions
export const getLocations = (): string[] => {
  try {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : ["Mumbai", "Chiplun", "Sawantwadi"];
  } catch (error) {
    console.error("Error getting locations:", error);
    return ["Mumbai", "Chiplun", "Sawantwadi"];
  }
};

export const checkDuplicateLot = (lotNumber: string): boolean => {
  try {
    const purchases = getStorageItem<any[]>('purchases');
    return purchases.some((p: any) => p.lotNumber === lotNumber && !p.isDeleted);
  } catch (error) {
    console.error("Error checking duplicate lot:", error);
    return false;
  }
};

export const getAgents = () => {
  return getStorageItem<any[]>('agents');
};

export const getSuppliers = () => {
  return getStorageItem<any[]>('suppliers');
};

export const getTransporters = () => {
  return getStorageItem<any[]>('transporters');
};

export const getBrokers = () => {
  return getStorageItem<any[]>('brokers');
};

export const getPurchases = () => {
  return getStorageItem<any[]>('purchases');
};

export const getCustomers = () => {
  return getStorageItem<any[]>('customers');
};
