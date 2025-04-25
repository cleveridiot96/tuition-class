
import { getStorageItem, saveStorageItem } from '../core/storageCore';
import { Purchase, Sale } from '../types';

// Purchases
export const getPurchases = (): Purchase[] => getStorageItem<Purchase[]>('purchases') || [];

export const savePurchases = (purchases: Purchase[]) => {
  saveStorageItem('purchases', purchases);
};

export const addPurchase = (purchase: Purchase) => {
  try {
    const purchases = getPurchases();
    purchases.push(purchase);
    saveStorageItem('purchases', purchases);
  } catch (error) {
    console.error("Error adding purchase:", error);
    throw error; // Re-throw to allow UI error handling
  }
};

export const updatePurchase = (purchaseId: string, updatedPurchase: Purchase) => {
  try {
    const purchases = getPurchases();
    const index = purchases.findIndex(p => p.id === purchaseId);
    if (index !== -1) {
      purchases[index] = updatedPurchase;
      saveStorageItem('purchases', purchases);
    }
  } catch (error) {
    console.error("Error updating purchase:", error);
    throw error;
  }
};

export const deletePurchase = (purchaseId: string) => {
  try {
    const purchases = getPurchases();
    const index = purchases.findIndex(p => p.id === purchaseId);
    if (index !== -1) {
      purchases[index] = { ...purchases[index], isDeleted: true };
      saveStorageItem('purchases', purchases);
    }
  } catch (error) {
    console.error("Error deleting purchase:", error);
    throw error;
  }
};

// Sales
export const getSales = (): Sale[] => getStorageItem<Sale[]>('sales') || [];

export const addSale = (sale: any) => {
  try {
    const sales = getSales();
    sales.push(sale);
    saveStorageItem('sales', sales);
  } catch (error) {
    console.error("Error adding sale:", error);
    throw error;
  }
};

export const updateSale = (saleId: string, updatedSale: any) => {
  try {
    const sales = getSales();
    const index = sales.findIndex(s => s.id === saleId);
    if (index !== -1) {
      sales[index] = updatedSale;
      saveStorageItem('sales', sales);
    }
  } catch (error) {
    console.error("Error updating sale:", error);
    throw error;
  }
};

export const deleteSale = (saleId: string) => {
  try {
    const sales = getSales().filter(s => s.id !== saleId);
    saveStorageItem('sales', sales);
  } catch (error) {
    console.error("Error deleting sale:", error);
    throw error;
  }
};

export const saveSales = (sales: Sale[]) => {
  saveStorageItem('sales', sales);
};

// Re-export inventory functions for backward compatibility
export { getInventory, saveInventory, updateInventoryAfterTransfer, updateInventoryAfterSale } from './inventory-storage';
