
import { getStorageItem, saveStorageItem, removeStorageItem } from '../core/storageCore';
import { StorageData } from '../types/storage.types';

// Basic storage operations
export const getAgents = () => getStorageItem<any[]>('agents') || [];
export const getBrokers = () => getStorageItem<any[]>('brokers') || [];
export const getCustomers = () => getStorageItem<any[]>('customers') || [];
export const getSuppliers = () => getStorageItem<any[]>('suppliers') || [];
export const getTransporters = () => getStorageItem<any[]>('transporters') || [];
export const getLocations = () => getStorageItem<string[]>('locations') || ['Mumbai', 'Chiplun', 'Sawantwadi'];
export const getMasters = () => getStorageItem<any[]>('masters') || [];

// Add party management functions
export const addAgent = (agent: any) => {
  const agents = getAgents();
  agents.push(agent);
  saveStorageItem('agents', agents);
};

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

export const addSupplier = (supplier: any) => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
};

export const addTransporter = (transporter: any) => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveStorageItem('transporters', transporters);
};

// Add backup related functions
export const getLastBackupTime = (): string | null => {
  return getStorageItem<string>('lastBackupTime');
};

export const getBackupList = (): string[] => {
  return getStorageItem<string[]>('backupList') || [];
};

export const getTransactions = (partyId: string, startDate: string, endDate: string) => {
  // This is a stub - you'll need to implement the actual logic
  return getStorageItem<any[]>('transactions') || [];
};

// Re-export core functions
export { getStorageItem, saveStorageItem, removeStorageItem };
