
import { Purchase } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

export const getPurchases = (): Purchase[] => {
  return getStorageItem<Purchase[]>('purchases') || [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  saveStorageItem('purchases', purchases);
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === updatedPurchase.id);
  
  if (index !== -1) {
    purchases[index] = updatedPurchase;
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
  saveStorageItem('purchases', purchases);
};
