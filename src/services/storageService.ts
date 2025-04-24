import { v4 as uuidv4 } from 'uuid';
import { getStorageItem, saveStorageItem } from './storageUtils';
import { toast } from 'sonner';
import { Purchase, Sale, Agent, Customer, Broker, Supplier, Transporter, Party } from './types';

// Re-export core storage utilities
export { getStorageItem, saveStorageItem } from './storageUtils';

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
} from './inventoryService';

// Re-export backup and data management functions
export { exportDataBackup } from './backup/exportBackup';
export { importDataBackup } from './backup/importBackup';

export { 
  clearAllData,
  clearAllMasterData,
  seedInitialData,
  completeFormatAllData
} from './backup/backupRestore';

export { 
  debugStorage,
  getStorageStats
} from './debug/storageDebug';

// Data model interfaces - re-export them all
export {
  Agent,
  Supplier,
  Customer,
  Broker,
  Transporter,
  Party,
  Purchase,
  Sale,
  Payment,
  Receipt,
  InventoryItem,
  EnhancedInventoryItem,
  SaleItem,
  BasePurchase
} from './types';

// Storage functions

// Locations
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

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === id);
  
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
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

// Entity management functions
export const getAgents = (): Agent[] => {
  return getStorageItem<Agent[]>('agents') || [];
};

export const getSuppliers = (): Supplier[] => {
  return getStorageItem<Supplier[]>('suppliers') || [];
};

export const getTransporters = (): Transporter[] => {
  return getStorageItem<Transporter[]>('transporters') || [];
};

export const getBrokers = (): Broker[] => {
  return getStorageItem<Broker[]>('brokers') || [];
};

export const getCustomers = (): Customer[] => {
  return getStorageItem<Customer[]>('customers') || [];
};

// Party functions (for ledger)
export const getParties = (): Party[] => {
  return getStorageItem<Party[]>('parties') || [];
};

export const getTransactions = () => {
  return getStorageItem('transactions') || [];
};

// Entity CRUD operations
export const addAgent = (agent: Omit<Agent, 'id'>): void => {
  const agents = getAgents();
  const newAgent = { ...agent, id: uuidv4() };
  agents.push(newAgent);
  saveStorageItem('agents', agents);
};

export const addSupplier = (supplier: Omit<Supplier, 'id'>): void => {
  const suppliers = getSuppliers();
  const newSupplier = { ...supplier, id: uuidv4() };
  suppliers.push(newSupplier);
  saveStorageItem('suppliers', suppliers);
};

export const addCustomer = (customer: Omit<Customer, 'id'>): void => {
  const customers = getCustomers();
  const newCustomer = { ...customer, id: uuidv4() };
  customers.push(newCustomer);
  saveStorageItem('customers', customers);
};

export const addBroker = (broker: Omit<Broker, 'id'>): void => {
  const brokers = getBrokers();
  const newBroker = { ...broker, id: uuidv4() };
  brokers.push(newBroker);
  saveStorageItem('brokers', brokers);
};

export const addTransporter = (transporter: Omit<Transporter, 'id'>): void => {
  const transporters = getTransporters();
  const newTransporter = { ...transporter, id: uuidv4() };
  transporters.push(newTransporter);
  saveStorageItem('transporters', transporters);
};

// Dashboard statistics
export const getTotalSalesValue = (): number => {
  const sales = getSales() || [];
  return sales
    .filter(sale => !sale.isDeleted)
    .reduce((total, sale) => total + (sale.totalAmount || 0), 0);
};

export const getTotalPurchaseValue = (): number => {
  const purchases = getPurchases() || [];
  return purchases
    .filter(p => !p.isDeleted)
    .reduce((total, purchase) => total + (purchase.totalAmount || 0), 0);
};

export const getTotalInventoryValue = (): number => {
  const inventory = getInventory() || [];
  return inventory
    .filter(item => !item.isDeleted && item.remainingQuantity > 0)
    .reduce((total, item) => total + (item.ratePerKgAfterExpenses * item.remainingQuantity), 0);
};

// Backup and Restore utilities
export const getLastBackupTime = (): string | null => {
  const backupTimestamp = getStorageItem<string>('lastBackupTime');
  return backupTimestamp;
};

export const getBackupList = (): string[] => {
  // This would typically return a list of available backups
  // For now, let's return a dummy implementation
  const lastBackup = getLastBackupTime();
  return lastBackup ? [lastBackup] : [];
};

// Payment and Receipt utilities
export const getNextPaymentNumber = (): string => {
  const payments = getStorageItem<any[]>('payments') || [];
  const latestNum = payments.length > 0 
    ? Math.max(...payments.map(p => {
        const num = parseInt(p.paymentNumber?.replace(/[^0-9]/g, '') || '0');
        return isNaN(num) ? 0 : num;
      }))
    : 0;
  return `PMT-${(latestNum + 1).toString().padStart(4, '0')}`;
};

export const getNextReceiptNumber = (): string => {
  const receipts = getStorageItem<any[]>('receipts') || [];
  const latestNum = receipts.length > 0 
    ? Math.max(...receipts.map(r => {
        const num = parseInt(r.receiptNumber?.replace(/[^0-9]/g, '') || '0');
        return isNaN(num) ? 0 : num;
      }))
    : 0;
  return `RCT-${(latestNum + 1).toString().padStart(4, '0')}`;
};
