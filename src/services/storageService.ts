
// Re-export all entity services for backward compatibility
export * from './types';
export * from './storageUtils';

// Specific services - ensuring all functions are properly exported
export { getAgents, addAgent, updateAgent, deleteAgent } from './agentService';
export * from './supplierService';
export * from './customerService';
export * from './brokerService';
export * from './transporterService';
export * from './purchaseService';
export * from './saleService';
export * from './inventoryService';
export * from './paymentService';
export * from './receiptService';

// Export updateAgentBalance separately to avoid conflicts
export { updateAgentBalance } from './agentService';
