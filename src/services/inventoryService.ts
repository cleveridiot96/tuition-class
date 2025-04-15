
import { InventoryItem } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getInventory = (): InventoryItem[] => {
  const inventory = getYearSpecificStorageItem<InventoryItem[]>('inventory') || [];
  return inventory;
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveYearSpecificStorageItem('inventory', inventory);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    inventory[index] = updatedItem;
    saveYearSpecificStorageItem('inventory', inventory);
  }
};

export const deleteInventoryItem = (id: string): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], isDeleted: true };
    saveYearSpecificStorageItem('inventory', inventory);
  }
};

export const updateInventoryAfterSale = (lotNumber: string, quantitySold: number): void => {
  const inventory = getInventory();
  const itemIndex = inventory.findIndex(
    item => item.lotNumber === lotNumber && !item.isDeleted
  );

  if (itemIndex !== -1) {
    const currentQuantity = inventory[itemIndex].remainingQuantity || inventory[itemIndex].quantity;
    inventory[itemIndex].remainingQuantity = Math.max(0, currentQuantity - quantitySold);
    saveYearSpecificStorageItem('inventory', inventory);
  }
};
