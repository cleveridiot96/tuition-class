
import { useToast } from "@/hooks/use-toast";

// Types
export interface Agent {
  id: string;
  name: string;
  address: string;
  balance: number;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  balance: number;
}

export interface Broker {
  id: string;
  name: string;
  address: string;
  commissionRate: number;
  balance: number;
}

export interface Transporter {
  id: string;
  name: string;
  address: string;
  balance: number;
}

export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  agent: string;
  agentId?: string; 
  party: string;
  partyId?: string;
  location: string;
  netWeight: number;
  rate: number;
  transporter: string;
  transporterId?: string;
  transportRate?: number;
  transportCost: number;
  totalAmount: number;
  expenses: number;
  broker?: string;
  brokerId?: string;
  brokerageRate?: number;
  brokerageAmount?: number;
  brokerageType?: "percentage" | "fixed";
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
  notes: string;
  isDeleted?: boolean;
}

export interface Sale {
  id: string;
  date: string;
  lotNumber: string;
  billNumber?: string;
  billAmount?: number;
  customer: string;
  customerId: string;
  quantity: number;
  netWeight: number;
  rate: number;
  broker?: string;
  brokerId?: string;
  brokerageRate?: number;
  brokerageAmount?: number;
  brokerageType?: "percentage" | "fixed";
  transporter?: string;
  transporterId?: string;
  transportRate?: number;
  transportCost: number;
  location?: string;
  notes?: string;
  totalAmount: number;
  netAmount: number;
  amount: number; // Added to match existing usage
  isDeleted?: boolean;
}

export interface Payment {
  id: string;
  date: string;
  party: string;
  partyId: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  notes: string;
  isDeleted?: boolean;
}

export interface Receipt {
  id: string;
  date: string;
  customer: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  notes: string;
  isDeleted?: boolean;
}

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
  netWeight: number;
  isDeleted?: boolean;
}

export interface LedgerEntry {
  id: string;
  date: string;
  partyName: string;
  partyType: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  referenceId?: string;
  referenceType?: string;
}

export interface CashBookEntry {
  id: string;
  date: string;
  description: string;
  type: "debit" | "credit"; // debit = outflow, credit = inflow
  amount: number;
}

// Locations function
export const getLocations = (): string[] => {
  const savedLocations = localStorage.getItem('locations');
  return savedLocations ? JSON.parse(savedLocations) : ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

// Storage service functions
export const getAgents = (): Agent[] => {
  const savedAgents = localStorage.getItem('agents');
  return savedAgents ? JSON.parse(savedAgents) : [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === id);
  if (index !== -1) {
    agents.splice(index, 1);
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const getSuppliers = (): Supplier[] => {
  const savedSuppliers = localStorage.getItem('suppliers');
  return savedSuppliers ? JSON.parse(savedSuppliers) : [];
};

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === id);
  if (index !== -1) {
    suppliers.splice(index, 1);
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }
};

export const getCustomers = (): Customer[] => {
  const savedCustomers = localStorage.getItem('customers');
  return savedCustomers ? JSON.parse(savedCustomers) : [];
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    localStorage.setItem('customers', JSON.stringify(customers));
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
    localStorage.setItem('customers', JSON.stringify(customers));
  }
};

export const getBrokers = (): Broker[] => {
  const savedBrokers = localStorage.getItem('brokers');
  return savedBrokers ? JSON.parse(savedBrokers) : [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  localStorage.setItem('brokers', JSON.stringify(brokers));
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    localStorage.setItem('brokers', JSON.stringify(brokers));
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === id);
  if (index !== -1) {
    brokers.splice(index, 1);
    localStorage.setItem('brokers', JSON.stringify(brokers));
  }
};

export const getTransporters = (): Transporter[] => {
  const savedTransporters = localStorage.getItem('transporters');
  return savedTransporters ? JSON.parse(savedTransporters) : [];
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  localStorage.setItem('transporters', JSON.stringify(transporters));
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    localStorage.setItem('transporters', JSON.stringify(transporters));
  }
};

export const deleteTransporter = (id: string): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === id);
  if (index !== -1) {
    transporters.splice(index, 1);
    localStorage.setItem('transporters', JSON.stringify(transporters));
  }
};

export const getPurchases = (): Purchase[] => {
  const savedPurchases = localStorage.getItem('purchases');
  return savedPurchases ? JSON.parse(savedPurchases) : [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === updatedPurchase.id);
  if (index !== -1) {
    purchases[index] = updatedPurchase;
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(purchase => purchase.id === id);
  if (index !== -1) {
    purchases[index] = { ...purchases[index], isDeleted: true };
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }
};

export const getSales = (): Sale[] => {
  const savedSales = localStorage.getItem('sales');
  return savedSales ? JSON.parse(savedSales) : [];
};

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
};

export const updateSale = (updatedSale: Sale): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  if (index !== -1) {
    sales[index] = updatedSale;
    localStorage.setItem('sales', JSON.stringify(sales));
  }
};

export const deleteSale = (id: string): void => {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === id);
  if (index !== -1) {
    sales[index] = { ...sales[index], isDeleted: true };
    localStorage.setItem('sales', JSON.stringify(sales));
  }
};

export const getInventory = (): any[] => {
  const savedInventory = localStorage.getItem('inventory');
  return savedInventory ? JSON.parse(savedInventory) : [];
};

export const saveInventory = (inventory: any[]): void => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

export const addInventoryItem = (item: any): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
};

export const updateInventoryAfterSale = (lotNumber: string, quantitySold: number): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.lotNumber === lotNumber && !item.isDeleted);
  
  if (index !== -1) {
    const item = inventory[index];
    const remainingQuantity = Math.max(0, item.remainingQuantity - quantitySold);
    
    inventory[index] = {
      ...item,
      remainingQuantity,
      isDeleted: remainingQuantity === 0 // Mark as deleted if no quantity remains
    };
    
    saveInventory(inventory);
  }
};

export const getPayments = (): Payment[] => {
  const savedPayments = localStorage.getItem('payments');
  return savedPayments ? JSON.parse(savedPayments) : [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === updatedPayment.id);
  if (index !== -1) {
    payments[index] = updatedPayment;
    localStorage.setItem('payments', JSON.stringify(payments));
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const index = payments.findIndex(payment => payment.id === id);
  if (index !== -1) {
    payments[index] = { ...payments[index], isDeleted: true };
    localStorage.setItem('payments', JSON.stringify(payments));
  }
};

export const getReceipts = (): Receipt[] => {
  const savedReceipts = localStorage.getItem('receipts');
  return savedReceipts ? JSON.parse(savedReceipts) : [];
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === updatedReceipt.id);
  if (index !== -1) {
    receipts[index] = updatedReceipt;
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(receipt => receipt.id === id);
  if (index !== -1) {
    receipts[index] = { ...receipts[index], isDeleted: true };
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }
};

export const updateAgentBalance = (id: string, amount: number, isCredit = false): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === id);
  
  if (index !== -1) {
    if (isCredit) {
      agents[index].balance -= amount;
    } else {
      agents[index].balance += amount;
    }
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const checkDuplicateLot = (lotNumber: string): boolean => {
  const purchases = getPurchases();
  return purchases.some(purchase => purchase.lotNumber === lotNumber && !purchase.isDeleted);
};

export const seedInitialData = (forceReset = false): void => {
  // Check if data already exists
  const hasAgents = localStorage.getItem('agents') !== null;
  
  if (!hasAgents || forceReset) {
    // Initialize each data type with empty arrays if not exists
    if (!localStorage.getItem('agents')) localStorage.setItem('agents', JSON.stringify([]));
    if (!localStorage.getItem('suppliers')) localStorage.setItem('suppliers', JSON.stringify([]));
    if (!localStorage.getItem('customers')) localStorage.setItem('customers', JSON.stringify([]));
    if (!localStorage.getItem('brokers')) localStorage.setItem('brokers', JSON.stringify([]));
    if (!localStorage.getItem('transporters')) localStorage.setItem('transporters', JSON.stringify([]));
    if (!localStorage.getItem('purchases')) localStorage.setItem('purchases', JSON.stringify([]));
    if (!localStorage.getItem('sales')) localStorage.setItem('sales', JSON.stringify([]));
    if (!localStorage.getItem('inventory')) localStorage.setItem('inventory', JSON.stringify([]));
    if (!localStorage.getItem('payments')) localStorage.setItem('payments', JSON.stringify([]));
    if (!localStorage.getItem('receipts')) localStorage.setItem('receipts', JSON.stringify([]));
    if (!localStorage.getItem('locations')) localStorage.setItem('locations', JSON.stringify(['Mumbai', 'Chiplun', 'Sawantwadi']));
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem('purchases');
  localStorage.removeItem('sales');
  localStorage.removeItem('inventory');
  localStorage.removeItem('payments');
  localStorage.removeItem('receipts');
};

export const clearAllMasterData = (): void => {
  localStorage.removeItem('agents');
  localStorage.removeItem('suppliers');
  localStorage.removeItem('customers');
  localStorage.removeItem('brokers');
  localStorage.removeItem('transporters');
};

export const exportDataBackup = (includeAll = true): string => {
  const backup: Record<string, any> = {};
  
  // Always include these
  backup.purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  backup.sales = JSON.parse(localStorage.getItem('sales') || '[]');
  backup.inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
  backup.payments = JSON.parse(localStorage.getItem('payments') || '[]');
  backup.receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  
  if (includeAll) {
    backup.agents = JSON.parse(localStorage.getItem('agents') || '[]');
    backup.suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    backup.customers = JSON.parse(localStorage.getItem('customers') || '[]');
    backup.brokers = JSON.parse(localStorage.getItem('brokers') || '[]');
    backup.transporters = JSON.parse(localStorage.getItem('transporters') || '[]');
    backup.locations = JSON.parse(localStorage.getItem('locations') || '["Mumbai", "Chiplun", "Sawantwadi"]');
  }
  
  return JSON.stringify(backup);
};

export const importDataBackup = (backupData: string): boolean => {
  try {
    const backup = JSON.parse(backupData);
    
    if (backup.purchases) localStorage.setItem('purchases', JSON.stringify(backup.purchases));
    if (backup.sales) localStorage.setItem('sales', JSON.stringify(backup.sales));
    if (backup.inventory) localStorage.setItem('inventory', JSON.stringify(backup.inventory));
    if (backup.payments) localStorage.setItem('payments', JSON.stringify(backup.payments));
    if (backup.receipts) localStorage.setItem('receipts', JSON.stringify(backup.receipts));
    
    if (backup.agents) localStorage.setItem('agents', JSON.stringify(backup.agents));
    if (backup.suppliers) localStorage.setItem('suppliers', JSON.stringify(backup.suppliers));
    if (backup.customers) localStorage.setItem('customers', JSON.stringify(backup.customers));
    if (backup.brokers) localStorage.setItem('brokers', JSON.stringify(backup.brokers));
    if (backup.transporters) localStorage.setItem('transporters', JSON.stringify(backup.transporters));
    if (backup.locations) localStorage.setItem('locations', JSON.stringify(backup.locations));
    
    return true;
  } catch (error) {
    console.error("Error importing backup:", error);
    return false;
  }
};

export const savePurchases = (purchases: Purchase[]): void => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};
