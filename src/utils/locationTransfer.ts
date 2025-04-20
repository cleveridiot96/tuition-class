
import { getLocations, getStorageItem, saveStorageItem } from '@/services/storageService';

interface LocationTransferParams {
  lotNumber: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: string;
}

export const transferBetweenLocations = ({
  lotNumber,
  fromLocation,
  toLocation,
  quantity,
  date
}: LocationTransferParams): boolean => {
  try {
    const inventory = getStorageItem<any[]>('inventory') || [];
    
    // Find inventory item at source location
    const sourceItem = inventory.find(item => 
      item.lotNumber === lotNumber && 
      item.location === fromLocation &&
      item.remainingQuantity >= quantity
    );
    
    if (!sourceItem) {
      console.error(`Inventory not found or insufficient quantity at ${fromLocation}`);
      return false;
    }
    
    // Update source item's quantity
    sourceItem.remainingQuantity -= quantity;
    
    // Check if destination already has this lot
    const destItem = inventory.find(item => 
      item.lotNumber === lotNumber && 
      item.location === toLocation
    );
    
    if (destItem) {
      // Add to existing destination
      destItem.remainingQuantity += quantity;
    } else {
      // Create new inventory entry at destination
      const newItem = {
        ...sourceItem,
        id: Date.now().toString(),
        location: toLocation,
        remainingQuantity: quantity,
        dateAdded: date || new Date().toISOString().split('T')[0],
        transferredFrom: fromLocation
      };
      
      inventory.push(newItem);
    }
    
    // Save updated inventory
    saveStorageItem('inventory', inventory);
    
    return true;
  } catch (error) {
    console.error("Error transferring inventory:", error);
    return false;
  }
};

export const getAvailableInventoryByLocation = (location: string): any[] => {
  const inventory = getStorageItem<any[]>('inventory') || [];
  return inventory.filter(item => 
    item.location === location && 
    item.remainingQuantity > 0 && 
    !item.isDeleted
  );
};
