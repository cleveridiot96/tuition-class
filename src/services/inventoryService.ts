import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export function getInventory() {
  return getYearSpecificStorageItem('inventory', []);
}

export function saveInventory(inventory: any) {
  saveYearSpecificStorageItem('inventory', inventory);
}

export function addInventoryItem(item: any) {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
}

export function updateInventoryAfterSale(sale: any) {
  const inventory = getInventory();
  const itemIndex = inventory.findIndex((item: any) => item.productName === sale.productName && item.location === sale.location);

  if (itemIndex !== -1) {
    inventory[itemIndex].quantity -= sale.quantity;
    inventory[itemIndex].netWeight -= sale.netWeight;
    saveInventory(inventory);
  }
}
