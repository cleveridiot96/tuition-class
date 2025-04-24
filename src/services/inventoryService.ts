
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { Purchase, Sale, InventoryItem } from './types';

export const getInventory = (): InventoryItem[] => {
  return getStorageItem<InventoryItem[]>('inventory') || [];
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  saveStorageItem('inventory', inventory);
};

export const addInventoryItem = (item: Omit<InventoryItem, 'id'>): void => {
  const inventory = getInventory();
  const newItem = { ...item, id: uuidv4() };
  inventory.push(newItem);
  saveInventory(inventory);
};

export const updateInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(i => i.id === item.id);
  
  if (index !== -1) {
    inventory[index] = item;
    saveInventory(inventory);
  }
};

export const deleteInventoryItem = (id: string): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(i => i.id === id);
  
  if (index !== -1) {
    inventory[index] = { ...inventory[index], isDeleted: true };
    saveInventory(inventory);
  }
};

export const updateInventoryAfterPurchase = (purchase: Purchase): void => {
  try {
    if (purchase.isDeleted) return;
    
    const inventory = getInventory();
    
    // Create new inventory item from purchase
    const inventoryItem: InventoryItem = {
      id: uuidv4(),
      purchaseId: purchase.id,
      lotNumber: purchase.lotNumber,
      date: purchase.date,
      quantity: purchase.bags,
      remainingQuantity: purchase.bags,
      location: purchase.location,
      netWeight: purchase.netWeight,
      rate: purchase.rate,
      ratePerKgAfterExpenses: purchase.ratePerKgAfterExpenses || 0,
      supplier: purchase.party,
      isDeleted: false
    };
    
    inventory.push(inventoryItem);
    saveInventory(inventory);
  } catch (error) {
    console.error("Error updating inventory after purchase:", error);
  }
};

export const updateInventoryAfterSale = (sale: Sale): void => {
  try {
    if (sale.isDeleted || !sale.items || sale.items.length === 0) return;
    
    const inventory = getInventory();
    
    // Update inventory based on sold items
    sale.items.forEach(saleItem => {
      const inventoryItem = inventory.find(item => item.id === saleItem.inventoryItemId);
      
      if (inventoryItem) {
        // Calculate remaining quantity after sale
        const remainingQty = (inventoryItem.remainingQuantity || inventoryItem.quantity) - saleItem.quantity;
        
        // Update inventory item
        inventoryItem.remainingQuantity = Math.max(0, remainingQty);
        
        // If completely sold, mark as effectively "sold out"
        if (inventoryItem.remainingQuantity === 0) {
          inventoryItem.isSoldOut = true;
        }
      }
    });
    
    saveInventory(inventory);
  } catch (error) {
    console.error("Error updating inventory after sale:", error);
  }
};

export const updateInventoryAfterTransfer = (
  inventory: InventoryItem[], 
  itemId: string, 
  quantity: number, 
  fromLocation: string, 
  toLocation: string
): InventoryItem[] => {
  try {
    // Create a deep copy of the inventory array
    const updatedInventory = [...inventory];
    
    // Find the source item
    const sourceItemIndex = updatedInventory.findIndex(item => item.id === itemId);
    
    if (sourceItemIndex === -1) {
      throw new Error("Inventory item not found");
    }
    
    const sourceItem = updatedInventory[sourceItemIndex];
    const availableQuantity = sourceItem.remainingQuantity || sourceItem.quantity;
    
    if (quantity > availableQuantity) {
      throw new Error("Transfer quantity exceeds available quantity");
    }
    
    // Update the source item's remaining quantity
    updatedInventory[sourceItemIndex] = {
      ...sourceItem,
      remainingQuantity: availableQuantity - quantity
    };
    
    // Create a new inventory item at the destination
    const destinationItem: InventoryItem = {
      id: uuidv4(),
      purchaseId: sourceItem.purchaseId,
      lotNumber: sourceItem.lotNumber,
      date: new Date().toISOString().split('T')[0],
      quantity: quantity,
      remainingQuantity: quantity,
      location: toLocation,
      netWeight: sourceItem.netWeight * (quantity / sourceItem.quantity),
      rate: sourceItem.rate,
      ratePerKgAfterExpenses: sourceItem.ratePerKgAfterExpenses,
      supplier: sourceItem.supplier,
      isDeleted: false,
      transferredFrom: sourceItem.id
    };
    
    // Add the new item to the inventory
    updatedInventory.push(destinationItem);
    
    return updatedInventory;
  } catch (error) {
    console.error("Error updating inventory after transfer:", error);
    throw error;
  }
};
