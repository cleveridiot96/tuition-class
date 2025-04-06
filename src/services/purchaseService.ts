
import { Purchase } from './types';
import { updateInventoryAfterPurchase, updateInventoryAfterPurchaseEdit, updateInventoryAfterPurchaseDelete } from './inventoryService';

// Purchase functions
export const getPurchases = () => {
  const purchases = localStorage.getItem('purchases');
  return purchases ? JSON.parse(purchases) : [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
  
  // Update inventory
  updateInventoryAfterPurchase(purchase);
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === updatedPurchase.id);
  
  if (index !== -1) {
    // Get old purchase to update inventory correctly
    const oldPurchase = purchases[index];
    
    // Update purchase
    purchases[index] = updatedPurchase;
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    // Update inventory based on changes
    updateInventoryAfterPurchaseEdit(oldPurchase, updatedPurchase);
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const purchaseToDelete = purchases.find(p => p.id === id);
  
  if (purchaseToDelete) {
    // Remove from purchases
    const updatedPurchases = purchases.filter(p => p.id !== id);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
    
    // Update inventory
    updateInventoryAfterPurchaseDelete(purchaseToDelete);
  }
};

export const savePurchases = (purchases: any[]) => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const checkDuplicateLot = (lotNumber: string, excludeId?: string): Purchase | null => {
  const purchases = getPurchases();
  return purchases.find(p => p.lotNumber === lotNumber && (excludeId ? p.id !== excludeId : true)) || null;
};
