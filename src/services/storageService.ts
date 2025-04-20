
// Re-export all storage-related functionality
export * from './core/storageCore';
export * from './core/yearSpecificStorage';
export * from './core/dataManagement';

// Re-export backup functionality
export * from './backup/backupService';
export * from './backup/backupRestore';
export * from './backup/exportBackup';
export * from './backup/importBackup';

// Re-export auto-save functionality
export * from './autosave/autoSaveService';

// Re-export system operations
export * from './system/systemOperations';

// Re-export debug functionality
export * from './debug/debugService';

// Re-export all entity-related functionality
export * from './entities/agentService';
export * from './entities/supplierService';
export * from './entities/customerService';
export * from './entities/brokerService';
export * from './entities/transporterService';

// Re-export inventory functionality
export * from './inventoryService';

// Re-export purchase functionality
export * from './purchaseService';

// Re-export sales functionality
export * from './saleService';
export * from './salesService';

// Re-export payment functionality
export * from './paymentService';

// Re-export receipt functionality
export * from './receiptService';

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
