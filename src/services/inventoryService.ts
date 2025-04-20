
import { InventoryItem, Purchase, Sale } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getInventory = (): InventoryItem[] => {
  return getStorageItem<InventoryItem[]>('inventory') || [];
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  saveStorageItem('inventory', inventory);
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    inventory[index] = updatedItem;
    saveInventory(inventory);
  }
};

export const deleteInventoryItem = (id: string): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === id);
  
  if (index !== -1) {
    inventory[index] = { ...inventory[index], isDeleted: true };
    saveInventory(inventory);
  }
};

export const updateInventoryAfterSale = (lotNumber: string, quantitySold: number): void => {
  const inventory = getInventory();
  const itemIndex = inventory.findIndex(item => item.lotNumber === lotNumber && !item.isDeleted);
  
  if (itemIndex !== -1) {
    inventory[itemIndex].quantity -= quantitySold;
    
    // If quantity becomes 0 or less, mark as deleted
    if (inventory[itemIndex].quantity <= 0) {
      inventory[itemIndex].isDeleted = true;
    }
    
    saveInventory(inventory);
  }
};
