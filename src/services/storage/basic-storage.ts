
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

// Re-export core functions
export { getStorageItem, saveStorageItem, removeStorageItem };
