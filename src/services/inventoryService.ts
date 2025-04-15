
import { InventoryItem } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getInventory = (): InventoryItem[] => {
  const items = getYearSpecificStorageItem<InventoryItem>('inventory') || [];
  
  // Normalize inventory items to ensure they have all required properties
  return items.map(item => ({
    id: item.id,
    lotNumber: item.lotNumber,
    quantity: item.quantity || 0,
    location: item.location || '',
    dateAdded: item.dateAdded || new Date().toISOString(),
    netWeight: item.netWeight || 0,
    remainingQuantity: item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity,
    purchaseRate: item.purchaseRate || 0,
    finalCost: item.finalCost || 0,
    agentId: item.agentId || '',
    agentName: item.agentName || '',
    date: item.date || item.dateAdded || new Date().toISOString(),
    isDeleted: item.isDeleted || false
  }));
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  // Normalize inventory items before saving
  const normalizedInventory = inventory.map(item => ({
    id: item.id,
    lotNumber: item.lotNumber,
    quantity: item.quantity || 0,
    location: item.location || '',
    dateAdded: item.dateAdded || new Date().toISOString(),
    netWeight: item.netWeight || 0,
    remainingQuantity: item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity,
    purchaseRate: item.purchaseRate || 0,
    finalCost: item.finalCost || 0,
    agentId: item.agentId || '',
    agentName: item.agentName || '',
    date: item.date || item.dateAdded || new Date().toISOString(),
    isDeleted: item.isDeleted || false
  }));
  
  saveYearSpecificStorageItem('inventory', normalizedInventory);
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  
  // Ensure the item has all required properties
  const normalizedItem = {
    id: item.id,
    lotNumber: item.lotNumber,
    quantity: item.quantity || 0,
    location: item.location || '',
    dateAdded: item.dateAdded || new Date().toISOString(),
    netWeight: item.netWeight || 0,
    remainingQuantity: item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity,
    purchaseRate: item.purchaseRate || 0,
    finalCost: item.finalCost || 0,
    agentId: item.agentId || '',
    agentName: item.agentName || '',
    date: item.date || item.dateAdded || new Date().toISOString(),
    isDeleted: item.isDeleted || false
  };
  
  inventory.push(normalizedItem);
  saveInventory(inventory);
};

export const updateInventoryAfterSale = (lotNumber: string, quantitySold: number): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.lotNumber === lotNumber && !item.isDeleted);
  
  if (index !== -1) {
    const item = inventory[index];
    // Calculate remaining quantity, using the remainingQuantity field if it exists, otherwise use the quantity
    const currentRemaining = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;
    const remainingQuantity = Math.max(0, currentRemaining - quantitySold);
    
    inventory[index] = {
      ...item,
      remainingQuantity: remainingQuantity,
      isDeleted: remainingQuantity === 0
    };
    
    saveInventory(inventory);
  }
};

// New function to support multi-item sales
export const updateInventoryForMultipleItems = (items: {lotNumber: string, quantity: number}[]): void => {
  const inventory = getInventory();
  let updated = false;
  
  items.forEach(saleItem => {
    const index = inventory.findIndex(item => 
      item.lotNumber === saleItem.lotNumber && !item.isDeleted
    );
    
    if (index !== -1) {
      const item = inventory[index];
      const currentRemaining = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;
      const remainingQuantity = Math.max(0, currentRemaining - saleItem.quantity);
      
      inventory[index] = {
        ...item,
        remainingQuantity: remainingQuantity,
        isDeleted: remainingQuantity === 0
      };
      
      updated = true;
    }
  });
  
  if (updated) {
    saveInventory(inventory);
  }
};

// Batch update inventory function
export const batchUpdateInventory = (updates: {lotNumber: string, quantityChange: number, isNewItem?: boolean}[]): void => {
  const inventory = getInventory();
  
  updates.forEach(update => {
    if (update.isNewItem) {
      // Handle logic for new inventory items if needed
    } else {
      // Update existing inventory
      const index = inventory.findIndex(item => item.lotNumber === update.lotNumber && !item.isDeleted);
      if (index !== -1) {
        const item = inventory[index];
        const currentRemaining = item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity;
        const remainingQuantity = Math.max(0, currentRemaining + update.quantityChange);
        
        inventory[index] = {
          ...item,
          remainingQuantity: remainingQuantity,
          isDeleted: remainingQuantity === 0
        };
      }
    }
  });
  
  saveInventory(inventory);
};

// Add a function to get default locations
export const getDefaultLocations = (): string[] => {
  return ["Mumbai", "Chiplun", "Sawantwadi"];
};

// Ensure location data is properly initialized
export const initializeLocations = (): void => {
  const locations = getYearSpecificStorageItem<string[]>('locations') || [];
  
  if (locations.length === 0) {
    // Add default locations if none are set
    const defaultLocations = getDefaultLocations();
    saveYearSpecificStorageItem('locations', defaultLocations);
  }
};

// Call this function during application startup
initializeLocations();
