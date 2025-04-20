
import { saveStorageItem } from './storageCore';

export const clearAllData = (): void => {
  try {
    const currentYear = localStorage.getItem('currentFinancialYear');
    const currentLocations = localStorage.getItem('locations');
    
    localStorage.clear();
    
    if (currentYear) localStorage.setItem('currentFinancialYear', currentYear);
    if (currentLocations) localStorage.setItem('locations', currentLocations);
    
    console.log("All transaction data cleared");
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

export const clearAllMasterData = (): void => {
  try {
    const masterKeys = ['agents', 'customers', 'suppliers', 'brokers', 'transporters'];
    masterKeys.forEach(key => localStorage.removeItem(key));
    console.log("All master data cleared");
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error("Error clearing master data:", error);
  }
};

export const seedInitialData = (silent: boolean = false): void => {
  try {
    if (!localStorage.getItem('locations')) {
      saveStorageItem('locations', ["Mumbai", "Chiplun", "Sawantwadi"]);
    }
    
    const dataTypes = [
      'agents', 'customers', 'suppliers', 'brokers', 'transporters',
      'inventory', 'purchases', 'sales', 'payments', 'receipts'
    ];
    
    dataTypes.forEach(type => {
      if (!localStorage.getItem(type)) {
        saveStorageItem(type, []);
      }
    });
    
    const yearSpecificTypes = ['inventory', 'purchases', 'sales', 'payments', 'receipts'];
    const currentYear = localStorage.getItem('currentFinancialYear');
    
    if (currentYear) {
      yearSpecificTypes.forEach(type => {
        const yearKey = `${type}_${currentYear}`;
        if (!localStorage.getItem(yearKey)) {
          saveStorageItem(yearKey, []);
        }
      });
    }
    
    if (!silent) console.log("Initial data seeded successfully");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};
