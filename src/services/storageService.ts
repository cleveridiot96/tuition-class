
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

// Re-export all entity-related functionality
export {
  getAgents,
  addAgent,
  updateAgent,
  deleteAgent,
  updateAgentBalance,
  getPurchaseAgents
} from './entities/agentService';

export {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from './entities/supplierService';

export {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from './entities/customerService';

export {
  getBrokers,
  addBroker,
  updateBroker,
  deleteBroker,
  getSalesBrokers
} from './entities/brokerService';

export {
  getTransporters,
  addTransporter,
  updateTransporter,
  deleteTransporter
} from './entities/transporterService';

// Re-export all types
export * from './types';

// Re-export all data management functionality
export {
  exportDataBackup,
  importDataBackup, 
  clearAllData, 
  clearAllMasterData, 
  seedInitialData
} from './backup/backupRestore';

