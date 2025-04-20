
// Re-export all storage-related functionality
export * from './core/storageCore';
export * from './core/yearSpecificStorage';
export * from './core/dataManagement';

// Re-export backup functionality
export {
  exportDataBackup,
  importDataBackup,
  clearAllData,
  clearAllMasterData,
  seedInitialData
} from './backup/backupRestore';

// Re-export auto-save functionality
export * from './autosave/autoSaveService';

// Re-export system operations
export * from './system/systemOperations';

// Re-export debug functionality
export * from './debug/debugService';

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

// Re-export inventory functionality
export * from './inventoryService';

// Re-export purchase functionality
export * from './purchaseService';

// Export sales functionality
export {
  getSales,
  addSale,
  updateSale,
  deleteSale,
  saveSales
} from './salesService';

// Export payment functionality
export * from './paymentService';

// Export receipt functionality
export {
  getReceipts,
  addReceipt,
  updateReceipt,
  deleteReceipt
} from './receiptService';

// Export all types
export * from './types';
