
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
  
  // Ensure all required fields
  const itemWithDefaults = {
    ...item,
    remainingQuantity: item.remainingQuantity ?? item.quantity,
    soldQuantity: item.soldQuantity ?? 0,
    remainingWeight: item.remainingWeight ?? item.netWeight
  };
  
  inventory.push(itemWithDefaults);
  saveInventory(inventory);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    // Ensure all required fields are present
    const itemWithDefaults = {
      ...updatedItem,
      remainingQuantity: updatedItem.remainingQuantity ?? updatedItem.quantity ?? inventory[index].quantity,
      soldQuantity: updatedItem.soldQuantity ?? inventory[index].soldQuantity ?? 0,
      remainingWeight: updatedItem.remainingWeight ?? updatedItem.netWeight ?? inventory[index].netWeight
    };
    
    inventory[index] = itemWithDefaults;
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
    // Update inventory item
    const originalQuantity = inventory[itemIndex].quantity;
    const originalWeight = inventory[itemIndex].netWeight;
    const weightPerUnit = originalWeight / originalQuantity;
    
    inventory[itemIndex].quantity -= quantitySold;
    inventory[itemIndex].remainingQuantity = inventory[itemIndex].quantity;
    inventory[itemIndex].soldQuantity = (inventory[itemIndex].soldQuantity || 0) + quantitySold;
    
    // Calculate new weight
    inventory[itemIndex].remainingWeight = inventory[itemIndex].quantity * weightPerUnit;
    
    // If quantity becomes 0 or less, mark as deleted
    if (inventory[itemIndex].quantity <= 0) {
      inventory[itemIndex].isDeleted = true;
    }
    
    saveInventory(inventory);
  }
};
