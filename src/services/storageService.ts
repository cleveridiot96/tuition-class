import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { toast } from 'sonner';
import { Purchase, Sale } from './types';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventoryAfterPurchase,
  updateInventoryAfterSale,
  updateInventoryAfterTransfer,
  saveInventory
} from './inventoryService';

// Re-export inventory functions for backward compatibility
export {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventoryAfterPurchase,
  updateInventoryAfterSale,
  updateInventoryAfterTransfer,
  saveInventory
};

// Other storage functions

export const getLocations = (): string[] => {
  return getStorageItem<string[]>('locations') || ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

export const saveLocations = (locations: string[]): void => {
  saveStorageItem('locations', locations);
};

// Purchases
export const getPurchases = (): Purchase[] => {
  return getStorageItem<Purchase[]>('purchases') || [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  savePurchases(purchases);
  
  // Update inventory after purchase
  updateInventoryAfterPurchase(purchase);
};

export const updatePurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === purchase.id);
  
  if (index !== -1) {
    purchases[index] = purchase;
    savePurchases(purchases);
  }
};

export const savePurchases = (purchases: Purchase[]): void => {
  saveStorageItem('purchases', purchases);
};

// Sales
export const getSales = (): Sale[] => {
  return getStorageItem<Sale[]>('sales') || [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  saveSales(sales);
  
  // Update inventory after sale
  updateInventoryAfterSale(sale);
};

export const updateSale = (sale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === sale.id);
  
  if (index !== -1) {
    sales[index] = sale;
    saveSales(sales);
  }
};

export const saveSales = (sales: Sale[]): void => {
  saveStorageItem('sales', sales);
};

export const deleteSale = (id: string): void => {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === id);
  
  if (index !== -1) {
    sales[index] = { ...sales[index], isDeleted: true };
    saveSales(sales);
  }
};

// Helper functions

export const checkDuplicateLot = (lotNumber: string): boolean => {
  const purchases = getPurchases() || [];
  return purchases.some(p => p.lotNumber === lotNumber && !p.isDeleted);
};

// Agent functions
export const getAgents = () => {
  return getStorageItem('agents') || [];
};

export const getSuppliers = () => {
  return getStorageItem('suppliers') || [];
};

export const getTransporters = () => {
  return getStorageItem('transporters') || [];
};

export const getBrokers = () => {
  return getStorageItem('brokers') || [];
};

export const getCustomers = () => {
  return getStorageItem('customers') || [];
};

// Party functions (for ledger)
export const getParties = () => {
  return getStorageItem('parties') || [];
};

export const getTransactions = () => {
  return getStorageItem('transactions') || [];
};

// Add other storage methods as needed
