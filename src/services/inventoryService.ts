
import { InventoryItem } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getInventory = (): InventoryItem[] => {
  return getYearSpecificStorageItem<InventoryItem>('inventory');
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
