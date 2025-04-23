
import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { InventoryItem, Purchase, Sale } from './types';
import { toast } from 'sonner';

export const getInventory = (): InventoryItem[] => {
  return getStorageItem<InventoryItem[]>('inventory') || [];
};

export const addInventoryItem = (item: InventoryItem): void => {
  // Check for duplicate lot number
  const inventory = getInventory();
  const duplicateItem = inventory.find(i => 
    i.lotNumber === item.lotNumber && 
    i.location === item.location && 
    !i.isDeleted
  );

  if (duplicateItem) {
    toast.warning(`Duplicate lot number detected: ${item.lotNumber}. This lot already exists in ${item.location}.`);
  }

  const newItem = {
    ...item,
    id: item.id || uuidv4(),
    dateAdded: item.dateAdded || new Date().toISOString(),
    bags: item.bags || item.quantity, // Ensure bags is initialized if not provided
  };

  inventory.push(newItem);
  saveStorageItem('inventory', inventory);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === updatedItem.id);
  
  if (index !== -1) {
    // Ensure bags property is maintained or updated correctly
    if (!updatedItem.bags && inventory[index].bags) {
      updatedItem.bags = inventory[index].bags;
    }
    
    inventory[index] = updatedItem;
    saveStorageItem('inventory', inventory);
  }
};

export const deleteInventoryItem = (id: string): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // Soft delete the item by marking it as deleted
    inventory[index] = { ...inventory[index], isDeleted: true };
    saveStorageItem('inventory', inventory);
  }
};

export const updateInventoryAfterPurchase = (purchase: Purchase): void => {
  if (!purchase.lotNumber) return;

  const inventoryItem: InventoryItem = {
    id: uuidv4(),
    lotNumber: purchase.lotNumber,
    quantity: purchase.bags || 0,
    bags: purchase.bags || 0,
    location: purchase.location || 'Default',
    dateAdded: purchase.date || new Date().toISOString(),
    purchaseId: purchase.id,
    netWeight: purchase.netWeight || 0,
    rate: purchase.rate || 0,
  };

  addInventoryItem(inventoryItem);
};

export const updateInventoryAfterSale = (sale: Sale): void => {
  if (!sale.lotNumber) return;

  const inventory = getInventory();
  const lotItems = inventory.filter(item => 
    item.lotNumber === sale.lotNumber && 
    !item.isDeleted && 
    item.quantity > 0
  );

  if (lotItems.length === 0) {
    // Create negative inventory entry if lot doesn't exist
    const negativeInventoryItem: InventoryItem = {
      id: uuidv4(),
      lotNumber: sale.lotNumber,
      quantity: -sale.quantity,
      bags: -sale.quantity,
      location: sale.location || 'Default',
      dateAdded: sale.date || new Date().toISOString(),
      saleId: sale.id,
      netWeight: -sale.netWeight || 0,
      rate: sale.rate || 0,
    };
    
    addInventoryItem(negativeInventoryItem);
    toast.warning(`Created negative inventory for lot ${sale.lotNumber}. Please add purchase to balance.`);
    return;
  }

  // Sort items by date added (oldest first)
  lotItems.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
  
  let remainingQuantity = sale.quantity;
  
  for (let i = 0; i < lotItems.length && remainingQuantity > 0; i++) {
    const item = lotItems[i];
    const quantityToDeduct = Math.min(item.quantity, remainingQuantity);
    
    // Update the inventory item
    const updatedItem = {
      ...item,
      quantity: item.quantity - quantityToDeduct,
      bags: (item.bags || item.quantity) - quantityToDeduct,
      netWeight: item.netWeight - (quantityToDeduct * (item.netWeight / (item.bags || item.quantity))),
    };
    
    updateInventoryItem(updatedItem);
    remainingQuantity -= quantityToDeduct;
  }
  
  // If there's still remaining quantity to deduct, create a negative inventory entry
  if (remainingQuantity > 0) {
    const negativeInventoryItem: InventoryItem = {
      id: uuidv4(),
      lotNumber: sale.lotNumber,
      quantity: -remainingQuantity,
      bags: -remainingQuantity,
      location: sale.location || lotItems[0].location,
      dateAdded: sale.date || new Date().toISOString(),
      saleId: sale.id,
      netWeight: -(remainingQuantity * (sale.netWeight / sale.quantity)),
      rate: sale.rate || 0,
    };
    
    addInventoryItem(negativeInventoryItem);
    toast.warning(`Created negative inventory for lot ${sale.lotNumber}. Sold ${remainingQuantity} more bags than available.`);
  }

  // Update inventory reference in the sale
  saveStorageItem('sales', getStorageItem('sales'));
};

export const saveInventory = (inventory: InventoryItem[]): void => {
  saveStorageItem('inventory', inventory);
};

// Add the missing function for inventory transfers
export const updateInventoryAfterTransfer = (
  inventory: InventoryItem[], 
  itemId: string, 
  quantity: number, 
  fromLocation: string, 
  toLocation: string
): InventoryItem[] => {
  // Find the source item
  const sourceItemIndex = inventory.findIndex(item => 
    item.id === itemId && item.location === fromLocation
  );
  
  if (sourceItemIndex === -1) {
    toast.error(`Item not found in ${fromLocation}`);
    return inventory;
  }
  
  const sourceItem = inventory[sourceItemIndex];
  
  // Check if there's enough quantity
  if ((sourceItem.remainingQuantity || 0) < quantity) {
    toast.error(`Not enough quantity available in ${fromLocation}`);
    return inventory;
  }
  
  // Update source item
  const updatedSourceItem = {
    ...sourceItem,
    remainingQuantity: (sourceItem.remainingQuantity || sourceItem.quantity) - quantity
  };
  
  // Check if destination already has this item
  const destItemIndex = inventory.findIndex(item => 
    item.lotNumber === sourceItem.lotNumber && 
    item.location === toLocation &&
    !item.isDeleted
  );
  
  const result = [...inventory];
  result[sourceItemIndex] = updatedSourceItem;
  
  if (destItemIndex !== -1) {
    // Update existing destination item
    const destItem = result[destItemIndex];
    result[destItemIndex] = {
      ...destItem,
      remainingQuantity: (destItem.remainingQuantity || destItem.quantity) + quantity
    };
  } else {
    // Create new inventory entry for the destination
    result.push({
      id: uuidv4(),
      lotNumber: sourceItem.lotNumber,
      quantity,
      remainingQuantity: quantity,
      location: toLocation,
      dateAdded: new Date().toISOString(),
      purchaseId: sourceItem.purchaseId,
      netWeight: sourceItem.netWeight ? (sourceItem.netWeight / sourceItem.quantity) * quantity : undefined,
      rate: sourceItem.rate,
      transferredFrom: fromLocation
    });
  }
  
  return result;
};
