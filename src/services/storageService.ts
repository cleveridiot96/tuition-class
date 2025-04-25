
// Re-export all storage operations from their respective modules
export * from './storage/basic-storage';
export * from './storage/inventory-storage';
export * from './storage/transaction-storage';
export * from './storage/payment-storage';

// Re-export types
export type { 
  Agent, 
  Broker, 
  Customer, 
  Supplier, 
  Transporter, 
  Purchase, 
  Sale, 
  InventoryItem,
  Payment,
  Receipt,
  SaleItem,
  BasePurchase,
  BaseEntity,
  Party,
  EnhancedInventoryItem
} from './types';

// Re-export master services
export {
  getMasters,
  addMaster,
  deleteMaster,
  updateMaster
} from './masterService';

// Re-export storage core functions
export { getStorageItem, saveStorageItem } from './core/storageCore';

// Re-export debug functions
export const debugStorage = {
  getAllData: () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  },
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return localStorage.getItem(key);
    }
  }
};

// Re-export backup operations
export { 
  exportDataBackup,
  importDataBackup,
  completeFormatAllData,
  exportToExcel
} from './storageUtils';

// Import necessary functions from transaction-storage
import { getPurchases, getSales } from './storage/transaction-storage';
import { getInventory } from './storage/inventory-storage';

// Dashboard-related functions
export const getTotalSalesValue = (): number => {
  const sales = getSales();
  return sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
};

export const getTotalPurchaseValue = (): number => {
  const purchases = getPurchases();
  return purchases.reduce((total, purchase) => total + (purchase.totalAmount || 0), 0);
};

export const getTotalInventoryValue = (): number => {
  const inventory = getInventory();
  return inventory.reduce((total, item) => total + (item.finalCost || 0), 0);
};

export const checkDuplicateLot = (lotNumber: string): boolean => {
  const purchases = getPurchases();
  return purchases.some(p => p.lotNumber === lotNumber && !p.isDeleted);
};

// Add backup management functions
export const getLastBackupTime = (): string | null => {
  try {
    return localStorage.getItem('lastBackupTime');
  } catch (error) {
    console.error("Error getting last backup time:", error);
    return null;
  }
};

export const getBackupList = (): string[] => {
  try {
    const backupList = localStorage.getItem('backupList');
    return backupList ? JSON.parse(backupList) : [];
  } catch (error) {
    console.error("Error getting backup list:", error);
    return [];
  }
};
