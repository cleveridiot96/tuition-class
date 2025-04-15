
import { getYearSpecificKey, getActiveFinancialYear } from "@/services/financialYearService";

// Generic storage helper functions
export const getStorageItem = <T>(key: string): T[] => {
  const savedItem = localStorage.getItem(key);
  return savedItem ? JSON.parse(savedItem) : [];
};

export const saveStorageItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getYearSpecificStorageItem = <T>(baseKey: string): T[] => {
  const key = getYearSpecificKey(baseKey);
  const savedItem = localStorage.getItem(key);
  return savedItem ? JSON.parse(savedItem) : [];
};

export const saveYearSpecificStorageItem = <T>(baseKey: string, data: T[]): void => {
  const key = getYearSpecificKey(baseKey);
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocations = (): string[] => {
  const savedLocations = localStorage.getItem('locations');
  return savedLocations ? JSON.parse(savedLocations) : ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

// Shared data management functions
export const seedInitialData = (forceReset = false): void => {
  const hasAgents = localStorage.getItem('agents') !== null;
  
  if (!hasAgents || forceReset) {
    if (!localStorage.getItem('agents')) localStorage.setItem('agents', JSON.stringify([]));
    if (!localStorage.getItem('suppliers')) localStorage.setItem('suppliers', JSON.stringify([]));
    if (!localStorage.getItem('customers')) localStorage.setItem('customers', JSON.stringify([]));
    if (!localStorage.getItem('brokers')) localStorage.setItem('brokers', JSON.stringify([]));
    if (!localStorage.getItem('transporters')) localStorage.setItem('transporters', JSON.stringify([]));
    
    const yearKeys = [
      getYearSpecificKey('purchases'),
      getYearSpecificKey('sales'),
      getYearSpecificKey('inventory'),
      getYearSpecificKey('payments'),
      getYearSpecificKey('receipts')
    ];
    
    yearKeys.forEach(key => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([]));
    });
    
    if (!localStorage.getItem('locations')) localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
  }
};

export const clearAllData = (): void => {
  const activeYear = getActiveFinancialYear();
  if (!activeYear) return;
  
  localStorage.removeItem(getYearSpecificKey('purchases'));
  localStorage.removeItem(getYearSpecificKey('sales'));
  localStorage.removeItem(getYearSpecificKey('inventory'));
  localStorage.removeItem(getYearSpecificKey('payments'));
  localStorage.removeItem(getYearSpecificKey('receipts'));
};

export const clearAllMasterData = (): void => {
  localStorage.removeItem('agents');
  localStorage.removeItem('suppliers');
  localStorage.removeItem('customers');
  localStorage.removeItem('brokers');
  localStorage.removeItem('transporters');
};

export const exportDataBackup = (includeAll = true): string => {
  const backup: Record<string, any> = {};
  
  const activeYear = getActiveFinancialYear();
  if (activeYear) {
    backup.activeYear = activeYear.id;
    backup.purchases = JSON.parse(localStorage.getItem(getYearSpecificKey('purchases')) || '[]');
    backup.sales = JSON.parse(localStorage.getItem(getYearSpecificKey('sales')) || '[]');
    backup.inventory = JSON.parse(localStorage.getItem(getYearSpecificKey('inventory')) || '[]');
    backup.payments = JSON.parse(localStorage.getItem(getYearSpecificKey('payments')) || '[]');
    backup.receipts = JSON.parse(localStorage.getItem(getYearSpecificKey('receipts')) || '[]');
  }
  
  if (includeAll) {
    backup.financialYears = JSON.parse(localStorage.getItem('financialYears') || '[]');
    
    backup.agents = JSON.parse(localStorage.getItem('agents') || '[]');
    backup.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    backup.customers = JSON.parse(localStorage.getItem('customers') || '[]');
    backup.brokers = JSON.parse(localStorage.getItem('brokers') || '[]');
    backup.transporters = JSON.parse(localStorage.getItem('transporters') || '[]');
    backup.locations = JSON.parse(localStorage.getItem('locations') || '["Mumbai", "Chiplun", "Sawantwadi"]');
    
    const years = backup.financialYears || [];
    const openingBalances: Record<string, any> = {};
    
    years.forEach((year: any) => {
      const key = `openingBalances_${year.id}`;
      const balancesStr = localStorage.getItem(key);
      if (balancesStr) {
        openingBalances[year.id] = JSON.parse(balancesStr);
      }
    });
    
    backup.openingBalances = openingBalances;
  }
  
  return JSON.stringify(backup);
};

export const importDataBackup = (backupData: string): boolean => {
  try {
    const backup = JSON.parse(backupData);
    
    if (backup.activeYear) {
      const yearId = backup.activeYear;
      
      if (backup.purchases) localStorage.setItem(`purchases_${yearId}`, JSON.stringify(backup.purchases));
      if (backup.sales) localStorage.setItem(`sales_${yearId}`, JSON.stringify(backup.sales));
      if (backup.inventory) localStorage.setItem(`inventory_${yearId}`, JSON.stringify(backup.inventory));
      if (backup.payments) localStorage.setItem(`payments_${yearId}`, JSON.stringify(backup.payments));
      if (backup.receipts) localStorage.setItem(`receipts_${yearId}`, JSON.stringify(backup.receipts));
    }
    
    if (backup.financialYears) localStorage.setItem('financialYears', JSON.stringify(backup.financialYears));
    
    if (backup.agents) localStorage.setItem('agents', JSON.stringify(backup.agents));
    if (backup.suppliers) localStorage.setItem('suppliers', JSON.stringify(backup.suppliers));
    if (backup.customers) localStorage.setItem('customers', JSON.stringify(backup.customers));
    if (backup.brokers) localStorage.setItem('brokers', JSON.stringify(backup.brokers));
    if (backup.transporters) localStorage.setItem('transporters', JSON.stringify(backup.transporters));
    if (backup.locations) localStorage.setItem('locations', JSON.stringify(backup.locations));
    
    if (backup.openingBalances) {
      Object.entries(backup.openingBalances).forEach(([yearId, balances]) => {
        const key = `openingBalances_${yearId}`;
        localStorage.setItem(key, JSON.stringify(balances));
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error importing backup:", error);
    return false;
  }
};

// Utility to check for duplicate lots
export const checkDuplicateLot = (lotNumber: string): boolean => {
  const purchases = getYearSpecificStorageItem<import('./types').Purchase>('purchases');
  return purchases.some(purchase => purchase.lotNumber === lotNumber && !purchase.isDeleted);
};
