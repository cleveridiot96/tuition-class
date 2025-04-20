
import { exportDataBackup, importDataBackup, clearAllData, clearAllMasterData, seedInitialData } from './storageUtils';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getStorageItem, saveStorageItem, removeStorageItem, getLocations, checkDuplicateLot } from './core/storageCore';
import type { Agent, Supplier, Customer, Broker, Transporter, Purchase, Sale, InventoryItem, Payment, Receipt, EnhancedInventoryItem } from './types';
import { 
  getAgents, addAgent, deleteAgent, updateAgent, updateAgentBalance,
  getCustomers, addCustomer, deleteCustomer, updateCustomer,
  getSuppliers, addSupplier, deleteSupplier, updateSupplier,
  getBrokers, getSalesBrokers, addBroker, deleteBroker, updateBroker,
  getTransporters, addTransporter, deleteTransporter, updateTransporter 
} from './agentService';
import { getPurchases, addPurchase, updatePurchase, deletePurchase, savePurchases } from './purchaseService';
import { getSales, addSale, updateSale, deleteSale, saveSales } from './salesService';
import { getInventory, saveInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, updateInventoryAfterSale } from './inventoryService';
import { getPayments, addPayment, updatePayment, deletePayment, savePayments } from './paymentService';
import { getReceipts, addReceipt, updateReceipt, deleteReceipt, saveReceipts } from './receiptService';

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
  type Agent, 
  type Supplier, 
  type Customer, 
  type Broker, 
  type Transporter, 
  type Purchase, 
  type Sale, 
  type InventoryItem,
  type EnhancedInventoryItem,
  type Payment, 
  type Receipt,

  // From agentService
  getAgents, 
  addAgent, 
  updateAgent, 
  deleteAgent, 
  updateAgentBalance,
  getCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer,
  getSuppliers, 
  addSupplier, 
  updateSupplier, 
  deleteSupplier,
  getBrokers, 
  getSalesBrokers, 
  addBroker, 
  updateBroker, 
  deleteBroker,
  getTransporters, 
  addTransporter, 
  updateTransporter, 
  deleteTransporter,
  
  // From purchaseService
  getPurchases, 
  addPurchase, 
  updatePurchase, 
  deletePurchase, 
  savePurchases,
  
  // From salesService
  getSales, 
  addSale, 
  updateSale, 
  deleteSale, 
  saveSales,
  
  // From inventoryService
  getInventory, 
  saveInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  updateInventoryAfterSale,
  
  // From paymentService
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
  savePayments,
  
  // From receiptService
  getReceipts,
  addReceipt,
  updateReceipt,
  deleteReceipt,
  saveReceipts
};

// Now let's define the getPurchaseAgents alias function in case it's used elsewhere
// This ensures backward compatibility
export const getPurchaseAgents = getAgents;

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
