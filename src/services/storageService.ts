
// Re-export all entity services for backward compatibility
export * from './types';
export * from './storageUtils';

// Specific services with explicit named exports to avoid confusion
export { 
  getAgents,
  getPurchaseAgents, 
  addAgent, 
  updateAgent, 
  deleteAgent,
  updateAgentBalance
} from './agentService';

export * from './supplierService';
export * from './customerService';

export { 
  getBrokers,
  getSalesBrokers, 
  addBroker, 
  updateBroker, 
  deleteBroker,
  updateBrokerBalance
} from './brokerService';

export * from './transporterService';
export * from './purchaseService';
export { getSales, addSale, updateSale, deleteSale, saveSales } from './saleService';
export * from './inventoryService';
export * from './paymentService';
export * from './receiptService';

// Explicitly re-export the debugStorage function
export { 
  debugStorage, 
  clearAllData, 
  exportDataBackup, 
  importDataBackup, 
  seedInitialData 
} from './storageUtils';
