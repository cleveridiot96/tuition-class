
import { getStorageItem, saveStorageItem } from '../core/storageCore';

export const getInventory = () => getStorageItem<any[]>('inventory') || [];

export const saveInventory = (inventory: any[]) => {
  saveStorageItem('inventory', inventory);
};

export const updateInventoryAfterTransfer = (updatedInventory: any[]) => {
  saveStorageItem('inventory', updatedInventory);
};

export const updateInventoryAfterSale = (updatedInventory: any[]) => {
  saveStorageItem('inventory', updatedInventory);
};
