
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
  return getStorageItem('agents') || [];
};

export const getBrokers = () => {
  return getStorageItem('brokers') || [];
};

export const getCustomers = () => {
  return getStorageItem('customers') || [];
};

export const getSuppliers = () => {
  return getStorageItem('suppliers') || [];
};

export const getTransporters = () => {
  return getStorageItem('transporters') || [];
};

export const getLocations = () => {
  return getStorageItem('locations') || ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

// Backup and System Operations
export { 
  exportDataBackup,
  importDataBackup,
  completeFormatAllData 
};

// Inventory and Transaction Related
export const getInventory = () => {
  return getStorageItem('inventory') || [];
};

export const saveInventory = (inventory: any[]) => {
  saveStorageItem('inventory', inventory);
};

export const updateInventoryAfterTransfer = (updatedInventory: any[]) => {
  saveStorageItem('inventory', updatedInventory);
};

// Dashboard Related Functions (placeholders)
export const getTotalSalesValue = () => {
  const sales = getStorageItem('sales') || [];
  return sales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
};

export const getTotalPurchaseValue = () => {
  const purchases = getStorageItem('purchases') || [];
  return purchases.reduce((total, purchase) => total + (purchase.totalAmount || 0), 0);
};

export const getTotalInventoryValue = () => {
  const inventory = getStorageItem('inventory') || [];
  return inventory.reduce((total, item) => total + (item.finalCost || 0), 0);
};

export const getLastBackupTime = () => {
  return getStorageItem('lastBackupTime') || null;
};

export const getBackupList = () => {
  return getStorageItem('backupList') || [];
};

// Purchase and Sale Related
export const getSales = () => {
  return getStorageItem('sales') || [];
};

export const getPurchases = () => {
  return getStorageItem('purchases') || [];
};

// Payment and Receipt Related
export const getPayments = () => {
  return getStorageItem('payments') || [];
};

export const getReceipts = () => {
  return getStorageItem('receipts') || [];
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
export * from '@/services/types';

