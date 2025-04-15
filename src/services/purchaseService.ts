
import { Purchase } from './types';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';

export const getPurchases = (): Purchase[] => {
  return getYearSpecificStorageItem<Purchase>('purchases');
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  saveYearSpecificStorageItem('purchases', purchases);
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === updatedPurchase.id);
  if (index !== -1) {
    purchases[index] = updatedPurchase;
    saveYearSpecificStorageItem('purchases', purchases);
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === id);
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    saveYearSpecificStorageItem('purchases', purchases);
  }
};

export const savePurchases = (purchases: Purchase[]): void => {
  saveYearSpecificStorageItem('purchases', purchases);
};
