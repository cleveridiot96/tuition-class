
import { v4 as uuidv4 } from 'uuid';
import { getYearSpecificStorageItem, saveYearSpecificStorageItem } from './storageUtils';
import { Purchase } from './types';

export function getPurchases(): Purchase[] {
  return getYearSpecificStorageItem('purchases', []);
}

export function savePurchases(purchases: Purchase[]): void {
  saveYearSpecificStorageItem('purchases', purchases);
}

export function addPurchase(purchase: Purchase): void {
  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);
}

export function updatePurchase(updatedPurchase: Purchase): void {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === updatedPurchase.id);
  
  if (index !== -1) {
    purchases[index] = updatedPurchase;
    savePurchases(purchases);
  }
}

export function deletePurchase(id: string): void {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === id);
  
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    savePurchases(purchases);
  }
}
