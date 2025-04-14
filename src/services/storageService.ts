
// Re-export all entity services for backward compatibility
export * from './types';
export * from './storageUtils';
export * from './agentService';
export * from './supplierService';
export * from './customerService';
export * from './brokerService';
export * from './transporterService';
export * from './purchaseService';
export * from './saleService';
export * from './financialYearService';
export {
  getInventory,
  saveInventory,
  addInventoryItem,
  updateInventoryAfterSale
} from './inventoryService';
export * from './paymentService';
export * from './receiptService';

// For backward compatibility, ensure these functions are always available
export { 
  getLocations, 
  saveLocations,
  checkDuplicateLot,
  exportDataBackup,
  importDataBackup,
  clearAllData,
  clearAllMasterData,
  seedInitialData,
  getYearSpecificStorageItem,
  saveYearSpecificStorageItem
} from './storageUtils';
