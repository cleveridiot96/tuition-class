
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
  saveYearSpecificStorageItem('inventory', inventory);
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
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
