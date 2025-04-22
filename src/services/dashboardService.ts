
import { getStorageItem } from './storageUtils';
import { getSales, getPurchases, getInventory } from './storageService';

// Calculate total sales value from all sales
export const getTotalSalesValue = (): number => {
  const sales = getSales() || [];
  return sales
    .filter(sale => !sale.isDeleted)
    .reduce((total, sale) => total + (sale.totalAmount || 0), 0);
};

// Calculate total purchase value from all purchases
export const getTotalPurchaseValue = (): number => {
  const purchases = getPurchases() || [];
  return purchases
    .filter(purchase => !purchase.isDeleted)
    .reduce((total, purchase) => total + (purchase.totalAfterExpenses || purchase.totalAmount || 0), 0);
};

// Calculate total inventory value
export const getTotalInventoryValue = (): number => {
  const inventory = getInventory() || [];
  return inventory
    .filter(item => !item.isDeleted && item.quantity > 0)
    .reduce((total, item) => total + (item.quantity * item.rate || 0), 0);
};

// Get last backup time from local storage
export const getLastBackupTime = (): string | null => {
  return getStorageItem('lastBackupTime');
};

// Get list of available backups
export const getBackupList = (): string[] => {
  return getStorageItem('backupList') || [];
};

// Generate next payment number
export const getNextPaymentNumber = (): string => {
  return `P-${Date.now().toString().slice(-6)}`;
};

// Generate next receipt number
export const getNextReceiptNumber = (): string => {
  return `R-${Date.now().toString().slice(-6)}`;
};
