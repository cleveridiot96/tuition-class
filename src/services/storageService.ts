
import { getStorageItem, saveStorageItem, removeStorageItem } from './core/storageCore';
import { exportDataBackup } from './backup/exportBackup';
import { importDataBackup } from './backup/importBackup';
import { completeFormatAllData } from './system/systemOperations';

// Re-export core storage functions
export { 
  getStorageItem, 
  saveStorageItem, 
  removeStorageItem 
} from './core/storageCore';

// Export utility functions for getting collections
export const getAgents = () => {
  return getStorageItem<any[]>('agents');
};

export const getBrokers = () => {
  return getStorageItem<any[]>('brokers');
};

export const getCustomers = () => {
  return getStorageItem<any[]>('customers');
};

export const getSuppliers = () => {
  return getStorageItem<any[]>('suppliers');
};

export const getTransporters = () => {
  return getStorageItem<any[]>('transporters');
};

export const getLocations = () => {
  return getStorageItem<string[]>('locations') || ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

// Add Agents function that was missing
export const addAgent = (agent: any) => {
  const agents = getAgents();
  agents.push(agent);
  saveStorageItem('agents', agents);
};

// Backup and System Operations
export { 
  exportDataBackup,
  importDataBackup,
  completeFormatAllData 
};

// Inventory and Transaction Related
export const getInventory = () => {
  return getStorageItem<any[]>('inventory');
};

export const saveInventory = (inventory: any[]) => {
  saveStorageItem('inventory', inventory);
};

export const updateInventoryAfterTransfer = (updatedInventory: any[]) => {
  saveStorageItem('inventory', updatedInventory);
};

// Add missing functions for transaction handling
export const getTransactions = (partyId: string, startDate: string, endDate: string): any[] => {
  // Placeholder implementation - you'll need to customize this
  const allTransactions = getStorageItem<any[]>('transactions');
  return allTransactions.filter(t => 
    t.partyId === partyId && 
    t.date >= startDate && 
    t.date <= endDate
  );
};

// Dashboard Related Functions (placeholders)
export const getTotalSalesValue = (): number => {
  const sales = getStorageItem<any[]>('sales');
  return sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
};

export const getTotalPurchaseValue = (): number => {
  const purchases = getStorageItem<any[]>('purchases');
  return purchases.reduce((total, purchase) => total + (purchase.totalAmount || 0), 0);
};

export const getTotalInventoryValue = (): number => {
  const inventory = getStorageItem<any[]>('inventory');
  return inventory.reduce((total, item) => total + (item.finalCost || 0), 0);
};

export const getLastBackupTime = (): string | null => {
  return getStorageItem<string>('lastBackupTime');
};

export const getBackupList = (): string[] => {
  return getStorageItem<string[]>('backupList');
};

// Purchase and Sale Related
export const getSales = () => {
  return getStorageItem<any[]>('sales');
};

export const getPurchases = () => {
  return getStorageItem<any[]>('purchases');
};

// Payment and Receipt Related
export const getPayments = () => {
  return getStorageItem<any[]>('payments');
};

export const getReceipts = () => {
  return getStorageItem<any[]>('receipts');
};

export const addPayment = (payment: any) => {
  const payments = getPayments();
  payments.push(payment);
  saveStorageItem('payments', payments);
};

export const updatePayment = (paymentId: string, updatedPayment: any) => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === paymentId);
  if (index !== -1) {
    payments[index] = updatedPayment;
    saveStorageItem('payments', payments);
  }
};

export const deletePayment = (paymentId: string) => {
  const payments = getPayments().filter(p => p.id !== paymentId);
  saveStorageItem('payments', payments);
};

export const getNextPaymentNumber = () => {
  const payments = getPayments();
  return `PAY-${payments.length + 1}`;
};

export const getNextReceiptNumber = () => {
  const receipts = getReceipts();
  return `RCP-${receipts.length + 1}`;
};

// Add missing CRUD operations
export const updatePurchase = (purchaseId: string, updatedPurchase: any) => {
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

export const addInventoryItem = (item: any) => {
  const inventory = getInventory();
  inventory.push(item);
  saveStorageItem('inventory', inventory);
};

export const checkDuplicateLot = (lotNumber: string): boolean => {
  const purchases = getPurchases();
  return purchases.some(p => p.lotNumber === lotNumber && !p.isDeleted);
};

export const addSupplier = (supplier: any) => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
};

// Placeholder for other entity-related additions
export const addCustomer = (customer: any) => {
  const customers = getCustomers();
  customers.push(customer);
  saveStorageItem('customers', customers);
};

export const addBroker = (broker: any) => {
  const brokers = getBrokers();
  brokers.push(broker);
  saveStorageItem('brokers', brokers);
};

export const addTransporter = (transporter: any) => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveStorageItem('transporters', transporters);
};

export const addPurchase = (purchase: any) => {
  const purchases = getPurchases();
  purchases.push(purchase);
  saveStorageItem('purchases', purchases);
};

// Re-export important types for convenience
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
} from '@/services/types';
