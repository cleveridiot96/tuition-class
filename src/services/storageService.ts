
// Re-export all storage-related functionality from core
export { 
  getStorageItem,
  saveStorageItem,
  removeStorageItem, 
  getLocations,
  checkDuplicateLot 
} from './core/storageCore';

// Re-export backup functionality
export { 
  createCompleteBackup,
  createPortableVersion 
} from './backup/backupService';

// Re-export auto-save functionality
export { 
  performAutoSave,
  checkAndRestoreAutoSave 
} from './autosave/autoSaveService';

// Re-export system operations
export { 
  completeFormatAllData,
  attemptDataRecovery 
} from './system/systemOperations';

// Re-export debug functionality
export { debugStorage } from './debug/debugService';

// Re-export all agent-related functionality
export * from './agentService';

// Re-export all inventory-related functionality
export * from './inventoryService';

// Re-export all purchase-related functionality
export * from './purchaseService';

// Re-export all sales-related functionality
export * from './salesService';

// Re-export all types
export * from './types';

// Re-export all data management functionality
export {
  exportDataBackup,
  importDataBackup, 
  clearAllData, 
  clearAllMasterData, 
  seedInitialData
} from './core/dataManagement';

// For backward compatibility
export { default as getPurchaseAgents } from './agentService';
