
import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { InventoryItem } from './types';

export function getInventory(): InventoryItem[] {
  return getYearSpecificStorageItem('inventory', []);
}

export function saveInventory(inventory: InventoryItem[]): void {
  saveYearSpecificStorageItem('inventory', inventory);
}

export function addInventoryItem(item: InventoryItem): void {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
}

export function updateInventoryAfterSale(lotNumber: string, quantity: number): void {
  const inventory = getInventory();
  const itemIndex = inventory.findIndex((item) => 
    item.lotNumber === lotNumber && !item.isDeleted
  );

  if (itemIndex !== -1) {
    inventory[itemIndex].quantity -= quantity;
    
    if (inventory[itemIndex].netWeight) {
      // Calculate how much of the net weight corresponds to this quantity
      const weightPerBag = inventory[itemIndex].netWeight / inventory[itemIndex].quantity;
      const weightToDeduct = weightPerBag * quantity;
      inventory[itemIndex].netWeight -= weightToDeduct;
    }
    
    // If quantity reaches 0, mark as deleted
    if (inventory[itemIndex].quantity <= 0) {
      inventory[itemIndex].isDeleted = true;
    }
    
    saveInventory(inventory);
  }
}
