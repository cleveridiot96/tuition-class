
import { getStorageItem, saveStorageItem } from '../core/storageCore';
import { Purchase, Sale } from '../types';

// Purchases
export const getPurchases = (): Purchase[] => getStorageItem<Purchase[]>('purchases') || [];

export const savePurchases = (purchases: Purchase[]) => {
  saveStorageItem('purchases', purchases);
};

export const addPurchase = (purchase: Purchase) => {
  const purchases = getPurchases();
  purchases.push(purchase);
  saveStorageItem('purchases', purchases);
};

export const updatePurchase = (purchaseId: string, updatedPurchase: Purchase) => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === purchaseId);
  if (index !== -1) {
    purchases[index] = updatedPurchase;
    saveStorageItem('purchases', purchases);
  }
};

export const deletePurchase = (purchaseId: string) => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === purchaseId);
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    saveStorageItem('purchases', purchases);
  }
};

// Sales
export const getSales = (): Sale[] => getStorageItem<Sale[]>('sales') || [];

export const addSale = (sale: any) => {
  const sales = getSales();
  sales.push(sale);
  saveStorageItem('sales', sales);
};

export const updateSale = (saleId: string, updatedSale: any) => {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === saleId);
  if (index !== -1) {
    sales[index] = updatedSale;
    saveStorageItem('sales', sales);
  }
};

export const deleteSale = (saleId: string) => {
  const sales = getSales().filter(s => s.id !== saleId);
  saveStorageItem('sales', sales);
};

export const saveSales = (sales: Sale[]) => {
  saveStorageItem('sales', sales);
};

// Re-export inventory functions for backward compatibility
export { getInventory, saveInventory, updateInventoryAfterTransfer, updateInventoryAfterSale } from './inventory-storage';
