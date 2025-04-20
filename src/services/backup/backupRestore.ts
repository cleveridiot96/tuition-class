import { Purchase, Sale, InventoryItem, Payment, Receipt } from '../types';
import { getStorageItem, saveStorageItem } from '../storageUtils';
import { getPayments, getReceipts } from '../paymentService';
import { exportDataBackup as exportData, importDataBackup as importData } from './exportBackup';

// Function to clear all data
export const clearAllData = () => {
  try {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Clear all data error:", error);
  }
};

// Function to clear all master data
export const clearAllMasterData = () => {
  try {
    localStorage.removeItem('agents');
    localStorage.removeItem('suppliers');
    localStorage.removeItem('customers');
    localStorage.removeItem('brokers');
    localStorage.removeItem('transporters');
    localStorage.removeItem('locations');
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Clear master data error:", error);
  }
};

// Function to seed initial data
export const seedInitialData = (force?: boolean) => {
  try {
    if (force || !getStorageItem('locations')) {
      saveStorageItem('locations', ["Mumbai", "Chiplun", "Sawantwadi"]);
    }
  } catch (error) {
    console.error("Seed initial data error:", error);
  }
};

export const exportDataBackup = exportData;
export const importDataBackup = importData;
