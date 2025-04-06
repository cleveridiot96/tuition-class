
import { InventoryItem, Purchase } from './types';

// Inventory functions
export const getInventory = () => {
  const inventory = localStorage.getItem('inventory');
  return inventory ? JSON.parse(inventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

export const getInventoryItem = (lotNumber: string): InventoryItem | undefined => {
  const inventory = getInventory();
  return inventory.find(item => item.lotNumber === lotNumber);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.lotNumber === updatedItem.lotNumber);
  
  if (index !== -1) {
    inventory[index] = updatedItem;
    saveInventory(inventory);
  } else {
    // Item doesn't exist, add it
    addInventoryItem(updatedItem);
  }
};

export const updateInventoryAfterPurchase = (purchase: Purchase): void => {
  const inventory = getInventory();
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === purchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    // Update existing item
    inventory[existingItemIndex].quantity += purchase.quantity;
    inventory[existingItemIndex].netWeight = (inventory[existingItemIndex].netWeight || 0) + purchase.netWeight;
  } else {
    // Add new item
    inventory.push({
      id: Date.now().toString() + '-inv',
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      location: purchase.location,
      dateAdded: purchase.date,
      netWeight: purchase.netWeight
    });
  }
  
  saveInventory(inventory);
};

export const updateInventoryAfterPurchaseEdit = (
  oldPurchase: Purchase, 
  newPurchase: Purchase
): void => {
  const inventory = getInventory();
  
  // First remove the old purchase from inventory
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === oldPurchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    // If lot number didn't change, just update the quantities
    if (oldPurchase.lotNumber === newPurchase.lotNumber) {
      inventory[existingItemIndex].quantity = 
        inventory[existingItemIndex].quantity - oldPurchase.quantity + newPurchase.quantity;
      
      inventory[existingItemIndex].netWeight = 
        (inventory[existingItemIndex].netWeight || 0) - oldPurchase.netWeight + newPurchase.netWeight;
        
      inventory[existingItemIndex].location = newPurchase.location;
    } else {
      // Lot number changed, need to adjust old item and maybe create new one
      inventory[existingItemIndex].quantity -= oldPurchase.quantity;
      inventory[existingItemIndex].netWeight = 
        (inventory[existingItemIndex].netWeight || 0) - oldPurchase.netWeight;
      
      // If old item has zero quantity, remove it
      if (inventory[existingItemIndex].quantity <= 0) {
        inventory.splice(existingItemIndex, 1);
      }
      
      // Look for the new lot number
      const newItemIndex = inventory.findIndex(item => item.lotNumber === newPurchase.lotNumber);
      if (newItemIndex !== -1) {
        // Update existing new lot
        inventory[newItemIndex].quantity += newPurchase.quantity;
        inventory[newItemIndex].netWeight = 
          (inventory[newItemIndex].netWeight || 0) + newPurchase.netWeight;
      } else {
        // Create new inventory item
        inventory.push({
          id: Date.now().toString() + '-inv',
          lotNumber: newPurchase.lotNumber,
          quantity: newPurchase.quantity,
          location: newPurchase.location,
          dateAdded: newPurchase.date,
          netWeight: newPurchase.netWeight
        });
      }
    }
  } else {
    // Old lot not found, just add as new
    const newItemIndex = inventory.findIndex(item => item.lotNumber === newPurchase.lotNumber);
    if (newItemIndex !== -1) {
      // Update existing 
      inventory[newItemIndex].quantity += newPurchase.quantity;
      inventory[newItemIndex].netWeight = 
        (inventory[newItemIndex].netWeight || 0) + newPurchase.netWeight;
    } else {
      // Create new
      inventory.push({
        id: Date.now().toString() + '-inv',
        lotNumber: newPurchase.lotNumber,
        quantity: newPurchase.quantity,
        location: newPurchase.location,
        dateAdded: newPurchase.date,
        netWeight: newPurchase.netWeight
      });
    }
  }
  
  saveInventory(inventory);
};

export const updateInventoryAfterPurchaseDelete = (purchase: Purchase): void => {
  const inventory = getInventory();
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === purchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    inventory[existingItemIndex].quantity -= purchase.quantity;
    inventory[existingItemIndex].netWeight = 
      (inventory[existingItemIndex].netWeight || 0) - purchase.netWeight;
    
    if (inventory[existingItemIndex].quantity <= 0) {
      inventory.splice(existingItemIndex, 1); // Remove item if quantity is zero or negative
    }
    
    saveInventory(inventory);
  }
};
