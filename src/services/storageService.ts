import { exportDataBackup, importDataBackup, clearAllData, clearAllMasterData, seedInitialData } from './storageUtils';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getStorageItem, saveStorageItem, removeStorageItem, getLocations, checkDuplicateLot } from './core/storageCore';
import { Agent } from './types';

// Export all the functions that are imported in other files
export {
  // From storageCore.ts
  getStorageItem,
  saveStorageItem,
  removeStorageItem, 
  getLocations,
  checkDuplicateLot,

  // From storageUtils.ts
  exportDataBackup,
  importDataBackup, 
  clearAllData, 
  clearAllMasterData, 
  seedInitialData,
  
  // Types
  Agent
};

// Re-export from agentService
export { getPurchaseAgents, getAgents, addAgent, updateAgent, deleteAgent, updateAgentBalance } from './agentService';

// Re-export the core functions
export const getSuppliers = () => {
  return getStorageItem('suppliers') || [];
};

export const getBrokers = () => {
  return getStorageItem('brokers') || [];
};

export const getCustomers = () => {
  return getStorageItem('customers') || [];
};

export const getTransporters = () => {
  return getStorageItem('transporters') || [];
};

export const getSalesBrokers = () => {
  return getStorageItem('brokers') || [];
};

export const getPurchases = () => {
  return getStorageItem('purchases') || [];
};

export const getSales = () => {
  return getStorageItem('sales') || [];
};

export const getPayments = () => {
  return getStorageItem('payments') || [];
};

export const getReceipts = () => {
  return getStorageItem('receipts') || [];
};

export const getInventory = () => {
  return getStorageItem('inventory') || [];
};

export const addSupplier = (supplier: any) => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
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

export const savePurchases = (purchases: any[]) => {
  saveStorageItem('purchases', purchases);
};

// Function to perform auto-save (for USB drive ejection scenarios)
export const performAutoSave = () => {
  try {
    // Create backup and store in sessionStorage (survives page reloads but not browser close)
    const backupData = exportDataBackup(true);
    if (backupData) {
      sessionStorage.setItem('autoSaveBackup', backupData);
      sessionStorage.setItem('autoSaveTimestamp', new Date().toISOString());
      return true;
    }
    return false;
  } catch (error) {
    console.error("Auto-save error:", error);
    return false;
  }
};

// Function to check for auto-save and restore if needed
export const checkAndRestoreAutoSave = () => {
  try {
    const autoSaveBackup = sessionStorage.getItem('autoSaveBackup');
    const timestamp = sessionStorage.getItem('autoSaveTimestamp');
    
    if (autoSaveBackup && timestamp) {
      // Return the data without automatically restoring
      return { 
        available: true, 
        timestamp: new Date(timestamp),
        restore: () => {
          const success = importDataBackup(autoSaveBackup);
          if (success) {
            // Clear the auto-save data after successful restore
            sessionStorage.removeItem('autoSaveBackup');
            sessionStorage.removeItem('autoSaveTimestamp');
          }
          return success;
        }
      };
    }
    
    return { available: false, timestamp: null, restore: null };
  } catch (error) {
    console.error("Auto-restore check error:", error);
    return { available: false, timestamp: null, restore: null };
  }
};

// Add debug function
export const debugStorage = () => {
  console.log("DEBUG: Storage content");
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          console.log(`${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? '...' : ''}`);
        } catch (e) {
          console.log(`${key}: [Error reading value]`);
        }
      }
    }
    
    console.log("DEBUG: End of storage content");
  } catch (error) {
    console.error("Error debugging storage:", error);
  }
};

// Creates a complete backup of all data in JSON format
export const createCompleteBackup = () => {
  try {
    return exportDataBackup();
  } catch (error) {
    console.error("Error creating backup:", error);
    return null;
  }
};

// Function to properly reset all data including receipts
export const completeFormatAllData = async () => {
  try {
    // First create a backup
    const backupData = exportDataBackup(true);
    
    // Save backup to localStorage before formatting
    if (backupData) {
      localStorage.setItem('preFormatBackup', backupData);
    }
    
    // Clear ALL localStorage completely
    localStorage.clear();
    
    // Small delay to ensure clearing is complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Re-initialize with fresh data
    seedInitialData(true);
    
    // Trigger storage event to notify components
    window.dispatchEvent(new Event('storage'));
    
    return true;
  } catch (error) {
    console.error("Complete format error:", error);
    return false;
  }
};

// Function to create portable version
export const createPortableVersion = async () => {
  try {
    // Create a backup of data
    const dataBackup = exportDataBackup();
    if (!dataBackup) {
      return { success: false, message: "Failed to create data backup" };
    }

    // Create zip file with all necessary files
    const zip = new JSZip();
    
    // Add data backup
    zip.file("data.json", dataBackup);
    
    // Add launcher HTML
    const launcherContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kisan Khata Sahayak - Portable</title>
  <script>
    // Flag that this is running in portable mode
    localStorage.setItem('portableMode', 'true');
    
    // Redirect to the main application with portable flag
    window.location.href = './index.html?portable=true';
  </script>
</head>
<body>
  <p>Loading Kisan Khata Sahayak...</p>
</body>
</html>`;
    
    zip.file("launcher.html", launcherContent);
    
    // Generate zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Save the zip file
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    saveAs(content, `KisanKhataSahayak_Portable_${dateStr}.zip`);
    
    return { success: true, message: "Portable version created successfully" };
  } catch (error) {
    console.error("Error creating portable version:", error);
    return { success: false, message: `Failed: ${error.message}` };
  }
};

// Function to attempt data recovery in case of crash
export const attemptDataRecovery = () => {
  try {
    // Check for pre-format backup
    const preFormatBackup = localStorage.getItem('preFormatBackup');
    if (preFormatBackup) {
      return { 
        available: true, 
        restore: () => importDataBackup(preFormatBackup) 
      };
    }
    
    return { available: false, restore: null };
  } catch (error) {
    console.error("Error checking for recovery data:", error);
    return { available: false, restore: null };
  }
};
