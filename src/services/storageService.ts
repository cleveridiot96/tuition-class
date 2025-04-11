
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
// Don't re-export getLocations from inventoryService as it's already exported from storageUtils
export { 
  getInventory,
  saveInventory,
  addInventoryItem,
  updateInventoryAfterSale
} from './inventoryService';
export * from './paymentService';
export * from './receiptService';
