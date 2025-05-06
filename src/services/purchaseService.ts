
import { Purchase } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getPurchases = (): Purchase[] => {
  return getStorageItem<Purchase[]>('purchases') || [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  
  // Ensure all required fields are present
  const purchaseWithDefaults = {
    ...purchase,
    transportCost: purchase.transportAmount ?? purchase.transportCost ?? 0,
    totalAfterExpenses: purchase.totalAfterExpenses ?? purchase.totalAmount
  };
  
  purchases.push(purchaseWithDefaults);
  saveStorageItem('purchases', purchases);
};

export const updatePurchase = (purchaseId: string, updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === purchaseId);
  
  if (index !== -1) {
    // Ensure transportCost is set if missing
    const purchaseWithDefaults = {
      ...updatedPurchase,
      transportCost: updatedPurchase.transportAmount ?? updatedPurchase.transportCost ?? purchases[index].transportCost ?? 0,
      totalAfterExpenses: updatedPurchase.totalAfterExpenses ?? updatedPurchase.totalAmount
    };
    
    purchases[index] = purchaseWithDefaults;
    saveStorageItem('purchases', purchases);
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === id);
  
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    saveStorageItem('purchases', purchases);
  }
};

export const savePurchases = (purchases: Purchase[]): void => {
  // Ensure all purchases have transportCost and totalAfterExpenses
  const normalizedPurchases = purchases.map(purchase => ({
    ...purchase,
    transportCost: purchase.transportAmount ?? purchase.transportCost ?? 0,
    totalAfterExpenses: purchase.totalAfterExpenses ?? purchase.totalAmount
  }));
  
  saveStorageItem('purchases', normalizedPurchases);
};
