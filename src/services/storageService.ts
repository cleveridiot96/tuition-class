
// Re-export all entity services for backward compatibility
export * from './types';
export * from './agentService';
export * from './supplierService';
export * from './customerService';
export * from './brokerService';
export * from './transporterService';
export * from './purchaseService';
export * from './saleService';  // This line ensures sale-related functions are exported
export * from './financialYearService';
export {
  getInventory,
  saveInventory,
  addInventoryItem,
  updateInventoryAfterSale
} from './inventoryService';
export * from './paymentService';
export * from './receiptService';

// Make sure we explicitly re-export the functions from saleService for clarity
export {
  getSales,
  saveSales,
  addSale,
  updateSale,
  deleteSale
} from './saleService';

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
  saveYearSpecificStorageItem,
  getStorageItem,
  saveStorageItem,
} from './storageUtils';
