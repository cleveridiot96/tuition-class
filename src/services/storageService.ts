
import { useToast } from "@/hooks/use-toast";

// This file re-exports all functionality from individual service files 
// to maintain compatibility with existing imports

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
  transporter: string;
  transporterId: string;
  transportRate: number;
  transportCost: number;
  location: string;
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

// Update storage keys
export const PURCHASES_STORAGE_KEY = "app_purchases_data";
export const INVENTORY_STORAGE_KEY = "app_inventory_data";
export const SALES_STORAGE_KEY = "app_sales_data";
export const PAYMENTS_STORAGE_KEY = "app_payments_data";
export const RECEIPTS_STORAGE_KEY = "app_receipts_data";
export const AGENTS_STORAGE_KEY = "app_agents_data";
export const BROKERS_STORAGE_KEY = "app_brokers_data";
export const CUSTOMERS_STORAGE_KEY = "app_customers_data";
export const TRANSPORTERS_STORAGE_KEY = "app_transporters_data";
export const CASHBOOK_STORAGE_KEY = "app_cashbook_data";
export const SUPPLIERS_STORAGE_KEY = "app_suppliers_data";

// Agent functions
export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem('agents');
  return agents ? JSON.parse(agents) : [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  
  // Prevent duplicate agents
  const existingAgent = agents.find(a => a.name === agent.name);
  if (existingAgent) {
    console.warn(`Agent with name ${agent.name} already exists. Using existing agent.`);
    return;
  }
  
  agents.push(agent);
  localStorage.setItem('agents', JSON.stringify(agents));
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents)); // Also save to new key
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    localStorage.setItem('agents', JSON.stringify(agents));
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents)); // Also save to new key
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getAgents();
  
  // Check if agent is used in any transactions
  const purchases = getPurchases();
  const agentInUse = purchases.some(p => 
    (p.agentId === id || p.partyId === id) && !p.isDeleted
  );
  
  if (agentInUse) {
    console.warn("Cannot delete agent that is used in transactions");
    return;
  }
  
  const updatedAgents = agents.filter(a => a.id !== id);
  localStorage.setItem('agents', JSON.stringify(updatedAgents));
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents)); // Also save to new key
};

export const updateAgentBalance = (id: string, amount: number): void => {
  const agents = getAgents();
  const agent = agents.find(a => a.id === id);
  if (agent) {
    agent.balance += amount;
    localStorage.setItem('agents', JSON.stringify(agents));
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents)); // Also save to new key
  }
};

// Supplier functions
export const getSuppliers = (): Supplier[] => {
  const suppliers = localStorage.getItem('suppliers') || localStorage.getItem(SUPPLIERS_STORAGE_KEY);
  return suppliers ? JSON.parse(suppliers) : [];
};

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  
  // Prevent duplicate suppliers
  const existingSupplier = suppliers.find(s => s.name === supplier.name);
  if (existingSupplier) {
    console.warn(`Supplier with name ${supplier.name} already exists. Using existing supplier.`);
    return;
  }
  
  suppliers.push(supplier);
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
  localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(suppliers)); // Also save to new key
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
    localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(suppliers)); // Also save to new key
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const updatedSuppliers = suppliers.filter(s => s.id !== id);
  localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
  localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(updatedSuppliers)); // Also save to new key
};

// Customer functions
export const getCustomers = (): Customer[] => {
  const customers = localStorage.getItem('customers') || localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  return customers ? JSON.parse(customers) : [];
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  
  // Check if customer with same name already exists to prevent duplicates
  const existingCustomer = customers.find(c => c.name === customer.name);
  if (existingCustomer) {
    console.warn(`Customer with name ${customer.name} already exists. Using existing customer.`);
    return; // Don't add duplicate customer
  }
  
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers)); // Also save to new key
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers)); // Also save to new key
  }
};

export const deleteCustomer = (id: string): void => {
  // Check if customer is used in any sales
  const sales = getSales();
  const customerInUse = sales.some(s => s.customerId === id && !s.isDeleted);
  
  if (customerInUse) {
    console.warn("Cannot delete customer that is used in sales");
    return;
  }
  
  const customers = getCustomers();
  const updatedCustomers = customers.filter(c => c.id !== id);
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(updatedCustomers)); // Also save to new key
};

// Broker functions
export const getBrokers = (): Broker[] => {
  const brokers = localStorage.getItem('brokers') || localStorage.getItem(BROKERS_STORAGE_KEY);
  return brokers ? JSON.parse(brokers) : [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  
  // Prevent duplicate brokers
  const existingBroker = brokers.find(b => b.name === broker.name);
  if (existingBroker) {
    console.warn(`Broker with name ${broker.name} already exists. Using existing broker.`);
    return;
  }
  
  brokers.push(broker);
  localStorage.setItem('brokers', JSON.stringify(brokers));
  localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(brokers)); // Also save to new key
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(b => b.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    localStorage.setItem('brokers', JSON.stringify(brokers));
    localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(brokers)); // Also save to new key
  }
};

export const deleteBroker = (id: string): void => {
  // Check if broker is used in any sales or purchases
  const sales = getSales();
  const purchases = getPurchases();
  
  const brokerInUse = 
    sales.some(s => s.brokerId === id && !s.isDeleted) || 
    purchases.some(p => p.brokerId === id && !p.isDeleted);
  
  if (brokerInUse) {
    console.warn("Cannot delete broker that is used in transactions");
    return;
  }
  
  const brokers = getBrokers();
  const updatedBrokers = brokers.filter(b => b.id !== id);
  localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
  localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(updatedBrokers)); // Also save to new key
};

// Transporter functions
export const getTransporters = (): Transporter[] => {
  const transporters = localStorage.getItem('transporters') || localStorage.getItem(TRANSPORTERS_STORAGE_KEY);
  return transporters ? JSON.parse(transporters) : [];
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  
  // Prevent duplicate transporters
  const existingTransporter = transporters.find(t => t.name === transporter.name);
  if (existingTransporter) {
    console.warn(`Transporter with name ${transporter.name} already exists. Using existing transporter.`);
    return;
  }
  
  transporters.push(transporter);
  localStorage.setItem('transporters', JSON.stringify(transporters));
  localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(transporters)); // Also save to new key
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(t => t.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    localStorage.setItem('transporters', JSON.stringify(transporters));
    localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(transporters)); // Also save to new key
  }
};

export const deleteTransporter = (id: string): void => {
  // Check if transporter is used in any sales or purchases
  const sales = getSales();
  const purchases = getPurchases();
  
  const transporterInUse = 
    sales.some(s => s.transporterId === id && !s.isDeleted) || 
    purchases.some(p => p.transporterId === id && !p.isDeleted);
  
  if (transporterInUse) {
    console.warn("Cannot delete transporter that is used in transactions");
    return;
  }
  
  const transporters = getTransporters();
  const updatedTransporters = transporters.filter(t => t.id !== id);
  localStorage.setItem('transporters', JSON.stringify(updatedTransporters));
  localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(updatedTransporters)); // Also save to new key
};

// Update transporter balance and ledger entry
export const updateTransporterBalance = (id: string, amount: number, description: string, date: string, referenceId: string): void => {
  const transporters = getTransporters();
  const transporter = transporters.find(t => t.id === id);
  if (transporter) {
    transporter.balance += amount;
    localStorage.setItem('transporters', JSON.stringify(transporters));
    localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(transporters)); // Also save to new key
    
    // Add ledger entry
    addLedgerEntry({
      id: Date.now().toString(),
      date,
      partyName: transporter.name,
      partyType: "transporter",
      description,
      debit: amount > 0 ? amount : 0,
      credit: amount < 0 ? Math.abs(amount) : 0,
      balance: transporter.balance,
      referenceId,
      referenceType: "transport"
    });
  }
};

// Purchase functions
export const getPurchases = () => {
  const purchases = localStorage.getItem(PURCHASES_STORAGE_KEY) || localStorage.getItem('purchases');
  return purchases ? JSON.parse(purchases) : [];
};

export const addPurchase = (purchase: Purchase): void => {
  // Ensure purchase has necessary fields
  if (!purchase.agentId) {
    const agents = getAgents();
    const agent = agents.find(a => a.name === purchase.agent);
    if (agent) {
      purchase.agentId = agent.id;
    } else {
      // Create agent if needed
      const newAgent: Agent = {
        id: "agent-" + Date.now().toString(),
        name: purchase.agent,
        address: "",
        balance: 0
      };
      addAgent(newAgent);
      purchase.agentId = newAgent.id;
    }
  }
  
  // Make sure transporterId is set if needed
  if (purchase.transporter && !purchase.transporterId) {
    const transporters = getTransporters();
    const transporter = transporters.find(t => t.name === purchase.transporter);
    if (transporter) {
      purchase.transporterId = transporter.id;
    } else if (purchase.transporter !== "Self" && purchase.transporter !== "") {
      // Create transporter if needed
      const newTransporter: Transporter = {
        id: "transporter-" + Date.now().toString(),
        name: purchase.transporter,
        address: "",
        balance: 0
      };
      addTransporter(newTransporter);
      purchase.transporterId = newTransporter.id;
    }
  }
  
  // Validate brokerage data if present
  if (purchase.broker && !purchase.brokerId) {
    const brokers = getBrokers();
    const broker = brokers.find(b => b.name === purchase.broker);
    if (broker) {
      purchase.brokerId = broker.id;
    } else if (purchase.broker !== "") {
      // Create broker if needed
      const newBroker: Broker = {
        id: "broker-" + Date.now().toString(),
        name: purchase.broker,
        address: "",
        commissionRate: purchase.brokerageRate || 1,
        balance: 0
      };
      addBroker(newBroker);
      purchase.brokerId = newBroker.id;
    }
  }
  
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  localStorage.setItem('purchases', JSON.stringify(purchases)); // For backward compatibility
  
  // Update inventory
  updateInventoryAfterPurchase(purchase);
  
  // Update transporter ledger if applicable
  if (purchase.transporterId && purchase.transportCost > 0) {
    updateTransporterBalance(
      purchase.transporterId,
      purchase.transportCost,
      `Transport for purchase lot ${purchase.lotNumber}`,
      purchase.date,
      purchase.id
    );
  }
  
  // Handle broker if present
  if (purchase.brokerId && purchase.brokerageAmount && purchase.brokerageAmount > 0) {
    // Add broker ledger entry
    addBrokerageEntry(
      purchase.brokerId,
      purchase.brokerageAmount,
      `Brokerage for purchase lot ${purchase.lotNumber}`,
      purchase.date,
      purchase.id
    );
  }
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === updatedPurchase.id);
  
  if (index !== -1) {
    // Get old purchase to update inventory correctly
    const oldPurchase = purchases[index];
    
    // Update purchase
    purchases[index] = updatedPurchase;
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
    localStorage.setItem('purchases', JSON.stringify(purchases)); // For backward compatibility
    
    // Update inventory based on changes
    updateInventoryAfterPurchaseEdit(oldPurchase, updatedPurchase);
    
    // Handle transporter changes if applicable
    if (updatedPurchase.transporterId && oldPurchase.transportCost !== updatedPurchase.transportCost) {
      // Remove old transporter ledger entry and add new one
      // In a real app, you would find and update the existing entry
      // For simplicity here, we're just adding a new adjustment entry
      if (updatedPurchase.transportCost > oldPurchase.transportCost) {
        updateTransporterBalance(
          updatedPurchase.transporterId,
          updatedPurchase.transportCost - oldPurchase.transportCost,
          `Updated transport for purchase lot ${updatedPurchase.lotNumber}`,
          updatedPurchase.date,
          updatedPurchase.id
        );
      }
    }
    
    // Handle broker changes
    if (updatedPurchase.brokerId && 
        (!oldPurchase.brokerageAmount || oldPurchase.brokerageAmount !== updatedPurchase.brokerageAmount)) {
      // If brokerage changed, add adjustment
      const difference = (updatedPurchase.brokerageAmount || 0) - (oldPurchase.brokerageAmount || 0);
      if (difference !== 0) {
        addBrokerageEntry(
          updatedPurchase.brokerId,
          difference,
          `Updated brokerage for purchase lot ${updatedPurchase.lotNumber}`,
          updatedPurchase.date,
          updatedPurchase.id
        );
      }
    }
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const purchaseToDelete = purchases.find(p => p.id === id);
  
  if (purchaseToDelete) {
    // Check if purchase lot is already sold
    const sales = getSales().filter(s => !s.isDeleted);
    const lotInUse = sales.some(s => s.lotNumber === purchaseToDelete.lotNumber);
    
    if (lotInUse) {
      console.error("Cannot delete purchase that has associated sales");
      return;
    }
    
    // Mark as deleted instead of removing
    const updatedPurchases = purchases.map(p => p.id === id ? { ...p, isDeleted: true } : p);
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedPurchases));
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases)); // For backward compatibility
    
    // Update inventory - mark related inventory item as deleted
    const inventory = getInventory();
    const updatedInventory = inventory.map(item => {
      if (item.lotNumber === purchaseToDelete.lotNumber) {
        return { ...item, isDeleted: true };
      }
      return item;
    });
    
    saveInventory(updatedInventory);
    
    // Add reversal entries for transporter and broker if applicable
    if (purchaseToDelete.transporterId && purchaseToDelete.transportCost > 0) {
      updateTransporterBalance(
        purchaseToDelete.transporterId,
        -purchaseToDelete.transportCost,
        `Reversed transport for deleted purchase lot ${purchaseToDelete.lotNumber}`,
        new Date().toISOString().split('T')[0],
        purchaseToDelete.id + "-reversal"
      );
    }
    
    if (purchaseToDelete.brokerId && purchaseToDelete.brokerageAmount && purchaseToDelete.brokerageAmount > 0) {
      addBrokerageEntry(
        purchaseToDelete.brokerId,
        -purchaseToDelete.brokerageAmount,
        `Reversed brokerage for deleted purchase lot ${purchaseToDelete.lotNumber}`,
        new Date().toISOString().split('T')[0],
        purchaseToDelete.id + "-reversal"
      );
    }
  }
};

export const savePurchases = (purchases: any[]) => {
  localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  localStorage.setItem('purchases', JSON.stringify(purchases)); // For backward compatibility
};

export const checkDuplicateLot = (lotNumber: string, excludeId?: string): Purchase | null => {
  const purchases = getPurchases();
  return purchases.find(p => p.lotNumber === lotNumber && (excludeId ? p.id !== excludeId : true) && !p.isDeleted) || null;
};

// Sales-related functions
export function getSales(): Sale[] {
  const savedSales = localStorage.getItem(SALES_STORAGE_KEY) || localStorage.getItem('sales');
  if (savedSales) {
    return JSON.parse(savedSales);
  }
  return [];
}

export function addSale(sale: Sale): void {
  // Create customer if it doesn't exist
  if (sale.customer && !sale.customerId.startsWith("customer-")) {
    const customerId = "customer-" + Date.now().toString();
    const newCustomer = {
      id: customerId,
      name: sale.customer,
      address: "",
      balance: 0
    };
    
    addCustomer(newCustomer);
    sale.customerId = customerId;
  }
  
  // Make sure transporterId is set if needed
  if (sale.transporter && !sale.transporterId) {
    const transporters = getTransporters();
    const transporter = transporters.find(t => t.name === sale.transporter);
    if (transporter) {
      sale.transporterId = transporter.id;
    } else if (sale.transporter !== "Self" && sale.transporter !== "") {
      // Create transporter if needed
      const newTransporter: Transporter = {
        id: "transporter-" + Date.now().toString(),
        name: sale.transporter,
        address: "",
        balance: 0
      };
      addTransporter(newTransporter);
      sale.transporterId = newTransporter.id;
    }
  }
  
  // Validate brokerage data if present
  if (sale.broker && !sale.brokerId) {
    const brokers = getBrokers();
    const broker = brokers.find(b => b.name === sale.broker);
    if (broker) {
      sale.brokerId = broker.id;
    } else if (sale.broker !== "") {
      // Create broker if needed
      const newBroker: Broker = {
        id: "broker-" + Date.now().toString(),
        name: sale.broker,
        address: "",
        commissionRate: sale.brokerageRate || 1,
        balance: 0
      };
      addBroker(newBroker);
      sale.brokerId = newBroker.id;
    }
  }

  // Check inventory availability before proceeding
  const inventoryItem = getInventoryItem(sale.lotNumber);
  if (!inventoryItem) {
    console.error(`No inventory found for lot ${sale.lotNumber}`);
    return;
  }
  
  if (inventoryItem.quantity < sale.quantity) {
    console.error(`Insufficient quantity in inventory. Available: ${inventoryItem.quantity}, Requested: ${sale.quantity}`);
    return;
  }

  const sales = getSales();
  sales.push(sale);
  
  // Save to both storage keys for consistency
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
  localStorage.setItem('sales', JSON.stringify(sales)); // For backward compatibility
  
  // Update inventory after sale
  updateInventoryAfterSale(sale.lotNumber, sale.quantity);
  
  // Handle transporter ledger if applicable
  if (sale.transporterId && sale.transportCost > 0) {
    updateTransporterBalance(
      sale.transporterId,
      sale.transportCost,
      `Transport for sale lot ${sale.lotNumber} to ${sale.customer}`,
      sale.date,
      sale.id
    );
  }
  
  // Handle broker if present
  if (sale.brokerId && sale.brokerageAmount && sale.brokerageAmount > 0) {
    addBrokerageEntry(
      sale.brokerId,
      sale.brokerageAmount,
      `Brokerage for sale lot ${sale.lotNumber} to ${sale.customer}`,
      sale.date,
      sale.id
    );
  }
}

export function updateSale(updatedSale: Sale): void {
  const sales = getSales();
  const index = sales.findIndex(sale => sale.id === updatedSale.id);
  
  if (index !== -1) {
    const oldSale = sales[index];
    
    // Handle inventory changes if quantity changed
    if (oldSale.quantity !== updatedSale.quantity) {
      // First, check if new quantity is available
      const inventoryItem = getInventoryItem(updatedSale.lotNumber);
      const availableQuantity = (inventoryItem ? inventoryItem.quantity : 0) + oldSale.quantity;
      
      if (availableQuantity < updatedSale.quantity) {
        console.error(`Insufficient quantity in inventory. Available: ${availableQuantity}, Requested: ${updatedSale.quantity}`);
        return;
      }
      
      // Restore old quantity to inventory
      updateInventoryAfterSale(oldSale.lotNumber, -oldSale.quantity);
      
      // Remove new quantity from inventory
      updateInventoryAfterSale(updatedSale.lotNumber, updatedSale.quantity);
    }
    
    // Update sale
    sales[index] = updatedSale;
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
    localStorage.setItem('sales', JSON.stringify(sales)); // For backward compatibility
    
    // Handle transporter changes
    if (updatedSale.transporterId && oldSale.transportCost !== updatedSale.transportCost) {
      if (updatedSale.transportCost > oldSale.transportCost) {
        updateTransporterBalance(
          updatedSale.transporterId,
          updatedSale.transportCost - oldSale.transportCost,
          `Updated transport for sale lot ${updatedSale.lotNumber}`,
          updatedSale.date,
          updatedSale.id
        );
      }
    }
    
    // Handle broker changes
    if (updatedSale.brokerId && 
        (!oldSale.brokerageAmount || oldSale.brokerageAmount !== updatedSale.brokerageAmount)) {
      const difference = (updatedSale.brokerageAmount || 0) - (oldSale.brokerageAmount || 0);
      if (difference !== 0) {
        addBrokerageEntry(
          updatedSale.brokerId,
          difference,
          `Updated brokerage for sale lot ${updatedSale.lotNumber}`,
          updatedSale.date,
          updatedSale.id
        );
      }
    }
  }
}

export function deleteSale(id: string): void {
  const sales = getSales();
  const saleToDelete = sales.find(sale => sale.id === id);
  
  if (saleToDelete) {
    // Mark as deleted
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, isDeleted: true } : sale
    );
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(updatedSales));
    localStorage.setItem('sales', JSON.stringify(updatedSales)); // For backward compatibility
    
    // Restore inventory quantity
    updateInventoryAfterSale(saleToDelete.lotNumber, -saleToDelete.quantity);
    
    // Reverse transporter ledger if applicable
    if (saleToDelete.transporterId && saleToDelete.transportCost > 0) {
      updateTransporterBalance(
        saleToDelete.transporterId,
        -saleToDelete.transportCost,
        `Reversed transport for deleted sale lot ${saleToDelete.lotNumber}`,
        new Date().toISOString().split('T')[0],
        saleToDelete.id + "-reversal"
      );
    }
    
    // Reverse brokerage if applicable
    if (saleToDelete.brokerId && saleToDelete.brokerageAmount && saleToDelete.brokerageAmount > 0) {
      addBrokerageEntry(
        saleToDelete.brokerId,
        -saleToDelete.brokerageAmount,
        `Reversed brokerage for deleted sale lot ${saleToDelete.lotNumber}`,
        new Date().toISOString().split('T')[0],
        saleToDelete.id + "-reversal"
      );
    }
  }
}

export function updateInventoryAfterSale(lotNumber: string, quantity: number): void {
  const inventory = getInventory();
  let foundValidItem = false;
  
  const updatedInventory = inventory.map(item => {
    if (item.lotNumber === lotNumber && !item.isDeleted) {
      foundValidItem = true;
      // We subtract the quantity when making a sale (positive quantity)
      // Or add it back when restoring a sale (negative quantity)
      const newQuantity = item.quantity - quantity;
      
      return {
        ...item,
        quantity: newQuantity
      };
    }
    return item;
  });
  
  if (!foundValidItem) {
    console.error(`No valid inventory item found for lot ${lotNumber}`);
  }
  
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedInventory));
  localStorage.setItem('inventory', JSON.stringify(updatedInventory)); // For backward compatibility
}

// Add a helper function for broker ledger entries
export const addBrokerageEntry = (
  brokerId: string, 
  amount: number, 
  description: string, 
  date: string, 
  referenceId: string
): void => {
  const brokers = getBrokers();
  const broker = brokers.find(b => b.id === brokerId);
  
  if (broker) {
    broker.balance += amount;
    localStorage.setItem('brokers', JSON.stringify(brokers));
    localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(brokers)); // For consistency
    
    // Add broker ledger entry
    addLedgerEntry({
      id: Date.now().toString(),
      date,
      partyName: broker.name,
      partyType: "broker",
      description,
      debit: amount > 0 ? amount : 0,
      credit: amount < 0 ? Math.abs(amount) : 0,
      balance: broker.balance,
      referenceId,
      referenceType: "brokerage"
    });
  }
};

// Payment functions
export const getPayments = () => {
  const payments = localStorage.getItem(PAYMENTS_STORAGE_KEY) || localStorage.getItem('payments');
  return payments ? JSON.parse(payments) : [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  localStorage.setItem('payments', JSON.stringify(payments)); // For backward compatibility
  
  // Create a cashbook entry for this payment
  addCashbookEntry(
    payment.date,
    `Payment to ${payment.party}: ${payment.notes}`,
    payment.amount, // debit
    0, // credit
    payment.id,
    'payment'
  );
};

// Update Payment functions
export const updatePayment = (payment: Payment): void => {
  const payments = getPayments();
  
  // Find original payment to handle cashbook updates
  const originalPayment = payments.find(p => p.id === payment.id);
  
  const updatedPayments = payments.map(p => 
    p.id === payment.id ? payment : p
  );
  
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updatedPayments));
  localStorage.setItem('payments', JSON.stringify(updatedPayments)); // For backward compatibility
  
  // Update cashbook entry if amount changed
  if (originalPayment && originalPayment.amount !== payment.amount) {
    // Find and update the corresponding cashbook entry
    const cashbookEntries = getLedgerEntries();
    const entryIndex = cashbookEntries.findIndex(e => 
      e.referenceId === payment.id && e.referenceType === 'payment'
    );
    
    if (entryIndex >= 0) {
      cashbookEntries[entryIndex] = {
        ...cashbookEntries[entryIndex],
        date: payment.date,
        description: `Payment to ${payment.party}: ${payment.notes}`,
        debit: payment.amount,
        credit: 0
      };
      
      localStorage.setItem('ledger', JSON.stringify(cashbookEntries));
    }
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const paymentToDelete = payments.find(p => p.id === id);
  
  // Mark as deleted instead of removing
  const updatedPayments = payments.map(p => 
    p.id === id ? { ...p, isDeleted: true } : p
  );
  
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(updatedPayments));
  localStorage.setItem('payments', JSON.stringify(updatedPayments)); // For backward compatibility
  
  // Add reversal entry to cashbook
  if (paymentToDelete) {
    addCashbookEntry(
      new Date().toISOString().split('T')[0],
      `Reversed payment to ${paymentToDelete.party}: ${paymentToDelete.notes}`,
      0, // debit
      paymentToDelete.amount, // credit (reverse of original debit)
      paymentToDelete.id + "-reversal",
      'payment-reversal'
    );
  }
};

// Receipt functions
export const getReceipts = () => {
  const receipts = localStorage.getItem(RECEIPTS_STORAGE_KEY) || localStorage.getItem('receipts');
  return receipts ? JSON.parse(receipts) : [];
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
  localStorage.setItem('receipts', JSON.stringify(receipts)); // For backward compatibility
  
  // Create a cashbook entry for this receipt
  addCashbookEntry(
    receipt.date,
    `Receipt from ${receipt.customer}: ${receipt.notes}`,
    0, // debit
    receipt.amount, // credit
    receipt.id,
    'receipt'
  );
};

export const updateReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  
  // Find original receipt to handle cashbook updates
  const originalReceipt = receipts.find(r => r.id === receipt.id);
  
  const updatedReceipts = receipts.map(r => 
    r.id === receipt.id ? receipt : r
  );
  
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(updatedReceipts));
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts)); // For backward compatibility
  
  // Update cashbook entry if amount changed
  if (originalReceipt && originalReceipt.amount !== receipt.amount) {
    // Find and update the corresponding cashbook entry
    const cashbookEntries = getLedgerEntries();
    const entryIndex = cashbookEntries.findIndex(e => 
      e.referenceId === receipt.id && e.referenceType === 'receipt'
    );
    
    if (entryIndex >= 0) {
      cashbookEntries[entryIndex] = {
        ...cashbookEntries[entryIndex],
        date: receipt.date,
        description: `Receipt from ${receipt.customer}: ${receipt.notes}`,
        debit: 0,
        credit: receipt.amount
      };
      
      localStorage.setItem('ledger', JSON.stringify(cashbookEntries));
    }
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const receiptToDelete = receipts.find(r => r.id === id);
  
  // Mark as deleted instead of removing
  const updatedReceipts = receipts.map(r => 
    r.id === id ? { ...r, isDeleted: true } : r
  );
  
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(updatedReceipts));
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts)); // For backward compatibility
  
  // Add reversal entry to cashbook
  if (receiptToDelete) {
    addCashbookEntry(
      new Date().toISOString().split('T')[0],
      `Reversed receipt from ${receiptToDelete.customer}: ${receiptToDelete.notes}`,
      receiptToDelete.amount, // debit (reverse of original credit)
      0, // credit
      receiptToDelete.id + "-reversal",
      'receipt-reversal'
    );
  }
};

// Inventory functions
export const getInventory = () => {
  const inventory = localStorage.getItem(INVENTORY_STORAGE_KEY) || localStorage.getItem('inventory');
  return inventory ? JSON.parse(inventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  localStorage.setItem('inventory', JSON.stringify(inventory)); // For backward compatibility
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  
  // Check for existing item with same lot number to prevent duplicates
  const existingIndex = inventory.findIndex(i => 
    i.lotNumber === item.lotNumber && !i.isDeleted
  );
  
  if (existingIndex >= 0) {
    // Update existing item instead of adding duplicate
    inventory[existingIndex].quantity += item.quantity;
    inventory[existingIndex].netWeight += item.netWeight;
  } else {
    // Add as new item
    inventory.push(item);
  }
  
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  localStorage.setItem('inventory', JSON.stringify(inventory)); // For backward compatibility
};

export const getInventoryItem = (lotNumber: string): InventoryItem | undefined => {
  const inventory = getInventory();
  return inventory.find(item => item.lotNumber === lotNumber && !item.isDeleted);
};

export const updateInventoryItem = (updatedItem: InventoryItem): void => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.lotNumber === updatedItem.lotNumber);
  
  if (index !== -1) {
    inventory[index] = updatedItem;
    saveInventory(inventory);
  } else {
    // Item doesn't exist, add it
    addInventoryItem(updatedItem);
  }
};

export const updateInventoryAfterPurchase = (purchase: Purchase): void => {
  const inventory = getInventory();
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === purchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    // Update existing item
    inventory[existingItemIndex].quantity += purchase.quantity;
    inventory[existingItemIndex].netWeight = (inventory[existingItemIndex].netWeight || 0) + purchase.netWeight;
    // Ensure it's not marked as deleted
    inventory[existingItemIndex].isDeleted = false;
  } else {
    // Add new item
    inventory.push({
      id: Date.now().toString() + '-inv',
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      location: purchase.location,
      dateAdded: purchase.date,
      netWeight: purchase.netWeight,
      isDeleted: false
    });
  }
  
  saveInventory(inventory);
};

export const updateInventoryAfterPurchaseEdit = (
  oldPurchase: Purchase, 
  newPurchase: Purchase
): void => {
  const inventory = getInventory();
  
  // First remove the old purchase from inventory
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === oldPurchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    // If lot number didn't change, just update the quantities
    if (oldPurchase.lotNumber === newPurchase.lotNumber) {
      inventory[existingItemIndex].quantity = 
        inventory[existingItemIndex].quantity - oldPurchase.quantity + newPurchase.quantity;
      
      inventory[existingItemIndex].netWeight = 
        (inventory[existingItemIndex].netWeight || 0) - oldPurchase.netWeight + newPurchase.netWeight;
        
      inventory[existingItemIndex].location = newPurchase.location;
      // Clear any deleted flag if present
      inventory[existingItemIndex].isDeleted = newPurchase.isDeleted;
    } else {
      // Lot number changed, need to adjust old item and maybe create new one
      inventory[existingItemIndex].quantity -= oldPurchase.quantity;
      inventory[existingItemIndex].netWeight = 
        (inventory[existingItemIndex].netWeight || 0) - oldPurchase.netWeight;
      
      // If old item has zero quantity, mark it as deleted
      if (inventory[existingItemIndex].quantity <= 0) {
        inventory[existingItemIndex].isDeleted = true;
      }
      
      // Look for the new lot number
      const newItemIndex = inventory.findIndex(item => item.lotNumber === newPurchase.lotNumber);
      if (newItemIndex !== -1) {
        // Update existing new lot
        inventory[newItemIndex].quantity += newPurchase.quantity;
        inventory[newItemIndex].netWeight = 
          (inventory[newItemIndex].netWeight || 0) + newPurchase.netWeight;
        inventory[newItemIndex].isDeleted = false; // Ensure it's not marked as deleted
      } else {
        // Create new inventory item
        inventory.push({
          id: Date.now().toString() + '-inv',
          lotNumber: newPurchase.lotNumber,
          quantity: newPurchase.quantity,
          location: newPurchase.location,
          dateAdded: newPurchase.date,
          netWeight: newPurchase.netWeight,
          isDeleted: false
        });
      }
    }
  } else {
    // Old lot not found, just add as new
    const newItemIndex = inventory.findIndex(item => item.lotNumber === newPurchase.lotNumber);
    if (newItemIndex !== -1) {
      // Update existing 
      inventory[newItemIndex].quantity += newPurchase.quantity;
      inventory[newItemIndex].netWeight = 
        (inventory[newItemIndex].netWeight || 0) + newPurchase.netWeight;
      inventory[newItemIndex].isDeleted = false; // Ensure it's not marked as deleted
    } else {
      // Create new
      inventory.push({
        id: Date.now().toString() + '-inv',
        lotNumber: newPurchase.lotNumber,
        quantity: newPurchase.quantity,
        location: newPurchase.location,
        dateAdded: newPurchase.date,
        netWeight: newPurchase.netWeight,
        isDeleted: false
      });
    }
  }
  
  saveInventory(inventory);
};

export const updateInventoryAfterPurchaseDelete = (purchase: Purchase): void => {
  const inventory = getInventory();
  const existingItemIndex = inventory.findIndex(item => item.lotNumber === purchase.lotNumber);
  
  if (existingItemIndex !== -1) {
    inventory[existingItemIndex].quantity -= purchase.quantity;
    inventory[existingItemIndex].netWeight = 
      (inventory[existingItemIndex].netWeight || 0) - purchase.netWeight;
    
    if (inventory[existingItemIndex].quantity <= 0) {
      // Mark as deleted instead of removing from array
      inventory[existingItemIndex].isDeleted = true;
    }
    
    saveInventory(inventory);
  }
};

// Ledger functions
export const getLedgerEntries = (): LedgerEntry[] => {
  const entries = localStorage.getItem('ledger');
  return entries ? JSON.parse(entries) : [];
};

export const getLedgerEntriesByParty = (partyName: string, partyType: string): LedgerEntry[] => {
  const entries = getLedgerEntries();
  const filteredEntries = entries.filter(entry => 
    entry.partyName === partyName && entry.partyType === partyType
  );
  
  // Calculate running balance for each entry
  let runningBalance = 0;
  const entriesWithBalance = filteredEntries.map(entry => {
    runningBalance += entry.credit - entry.debit;
    return { ...entry, balance: runningBalance };
  });
  
  return entriesWithBalance;
};

export const addLedgerEntry = (entry: LedgerEntry): void => {
  const entries = getLedgerEntries();
  entries.push(entry);
  localStorage.setItem('ledger', JSON.stringify(entries));
};

// Cash book entries functions
export const getCashBookEntries = (): CashBookEntry[] => {
  const entries = localStorage.getItem(CASHBOOK_STORAGE_KEY);
  return entries ? JSON.parse(entries) : [];
};

export const addCashBookEntry = (entry: CashBookEntry): void => {
  const entries = getCashBookEntries();
  entries.push(entry);
  localStorage.setItem(CASHBOOK_STORAGE_KEY, JSON.stringify(entries));
};

export const updateCashBookEntry = (updatedEntry: CashBookEntry): void => {
  const entries = getCashBookEntries();
  const index = entries.findIndex(e => e.id === updatedEntry.id);
  
  if (index !== -1) {
    entries[index] = updatedEntry;
    localStorage.setItem(CASHBOOK_STORAGE_KEY, JSON.stringify(entries));
  }
};

export const deleteCashBookEntry = (id: string): void => {
  const entries = getCashBookEntries();
  const updatedEntries = entries.filter(e => e.id !== id);
  localStorage.setItem(CASHBOOK_STORAGE_KEY, JSON.stringify(updatedEntries));
};

// Function to create a cashbook entry
export const addCashbookEntry = (
  date: string,
  description: string, 
  debit: number = 0, 
  credit: number = 0, 
  referenceId?: string,
  referenceType?: string
): void => {
  const entries = getLedgerEntries();
  
  // Create a new entry with "Cash" as the party
  const newEntry: LedgerEntry = {
    id: Date.now().toString(),
    date,
    partyName: "Cash",
    partyType: "cash",
    description,
    debit,
    credit,
    balance: 0, // Will be calculated when retrieved
    referenceId,
    referenceType
  };
  
  entries.push(newEntry);
  localStorage.setItem('ledger', JSON.stringify(entries));
};

// Modify the exportDataBackup function to accept a silent parameter
export const exportDataBackup = (silent = false) => {
  try {
    const data = {
      purchases: JSON.parse(localStorage.getItem(PURCHASES_STORAGE_KEY) || localStorage.getItem('purchases') || '[]'),
      sales: JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || localStorage.getItem('sales') || '[]'),
      inventory: JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || localStorage.getItem('inventory') || '[]'),
      agents: JSON.parse(localStorage.getItem(AGENTS_STORAGE_KEY) || localStorage.getItem('agents') || '[]'),
      suppliers: JSON.parse(localStorage.getItem(SUPPLIERS_STORAGE_KEY) || localStorage.getItem('suppliers') || '[]'),
      customers: JSON.parse(localStorage.getItem(CUSTOMERS_STORAGE_KEY) || localStorage.getItem('customers') || '[]'),
      brokers: JSON.parse(localStorage.getItem(BROKERS_STORAGE_KEY) || localStorage.getItem('brokers') || '[]'),
      transporters: JSON.parse(localStorage.getItem(TRANSPORTERS_STORAGE_KEY) || localStorage.getItem('transporters') || '[]'),
      ledger: JSON.parse(localStorage.getItem('ledger') || '[]'),
      payments: JSON.parse(localStorage.getItem(PAYMENTS_STORAGE_KEY) || localStorage.getItem('payments') || '[]'),
      receipts: JSON.parse(localStorage.getItem(RECEIPTS_STORAGE_KEY) || localStorage.getItem('receipts') || '[]'),
      cashbook: JSON.parse(localStorage.getItem(CASHBOOK_STORAGE_KEY) || '[]'),
    };

    // Convert data to JSON string with clear formatting for offline editing
    const jsonData = JSON.stringify(data, null, 2);

    // If silent mode is requested, just return the JSON data
    if (silent) {
      return jsonData;
    }

    // Otherwise, trigger a download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Try to export Excel format as well
    try {
      exportExcelBackup(data);
    } catch (excelError) {
      console.error('Error exporting Excel backup:', excelError);
    }

    return jsonData;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

// Function to export data in Excel-compatible format
export const exportExcelBackup = (data: any) => {
  // This is a simplified version - in a real app you'd use a library like xlsx
  // For now we'll create a CSV format which Excel can open
  try {
    // Add header comments to make it clear how to edit
    const headerComment = "# BUSINESS DATA BACKUP\n" +
                         "# This file contains your business data in CSV format.\n" +
                         "# You can edit this file in Excel or any text editor.\n" +
                         "# IMPORTANT: Do not change the structure or remove any columns.\n" +
                         "# Date format should be YYYY-MM-DD\n" +
                         "# After editing, save as CSV and import back into the system.\n\n";
    
    // Purchases CSV
    let purchasesCSV = headerComment + "ID,Date,Lot Number,Quantity,Agent,Party,Location,Net Weight,Rate,Total Amount,Transport Cost,Is Deleted\n";
    data.purchases.forEach((p: any) => {
      purchasesCSV += `${p.id},${p.date},${p.lotNumber},${p.quantity},${p.agent},${p.party},${p.location},${p.netWeight},${p.rate},${p.totalAmount},${p.transportCost},${p.isDeleted ? "TRUE" : "FALSE"}\n`;
    });

    // Inventory CSV
    let inventoryCSV = headerComment + "ID,Lot Number,Quantity,Location,Date Added,Net Weight,Is Deleted\n";
    data.inventory.forEach((i: any) => {
      inventoryCSV += `${i.id},${i.lotNumber},${i.quantity},${i.location},${i.dateAdded},${i.netWeight || 0},${i.isDeleted ? "TRUE" : "FALSE"}\n`;
    });
    
    // Sales CSV
    let salesCSV = headerComment + "ID,Date,Lot Number,Customer,Quantity,Rate,Net Weight,Total Amount,Is Deleted\n";
    data.sales.forEach((s: any) => {
      salesCSV += `${s.id},${s.date},${s.lotNumber},${s.customer},${s.quantity},${s.rate},${s.netWeight},${s.totalAmount},${s.isDeleted ? "TRUE" : "FALSE"}\n`;
    });
    
    // Agents CSV
    let agentsCSV = headerComment + "ID,Name,Address,Balance\n";
    data.agents.forEach((a: any) => {
      agentsCSV += `${a.id},${a.name},${a.address},${a.balance}\n`;
    });
    
    // Customers CSV
    let customersCSV = headerComment + "ID,Name,Address,Balance\n";
    data.customers.forEach((c: any) => {
      customersCSV += `${c.id},${c.name},${c.address},${c.balance}\n`;
    });

    // Download all CSV files
    downloadCSV(purchasesCSV, `purchases-backup-${new Date().toISOString().split('T')[0]}.csv`);
    downloadCSV(inventoryCSV, `inventory-backup-${new Date().toISOString().split('T')[0]}.csv`);
    downloadCSV(salesCSV, `sales-backup-${new Date().toISOString().split('T')[0]}.csv`);
    downloadCSV(agentsCSV, `agents-backup-${new Date().toISOString().split('T')[0]}.csv`);
    downloadCSV(customersCSV, `customers-backup-${new Date().toISOString().split('T')[0]}.csv`);

    return true;
  } catch (error) {
    console.error('Error creating Excel backup:', error);
    return false;
  }
};

// Helper function to download CSV
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importDataBackup = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Check if the data object has the required properties
    if (!data || typeof data !== 'object') {
      console.error('Invalid backup data format');
      return false;
    }
    
    // Create a backup before importing
    exportDataBackup(true);
    
    // Set each data item in localStorage if present
    if ('purchases' in data) {
      localStorage.setItem('purchases', JSON.stringify(data.purchases));
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(data.purchases));
    }
    
    if ('sales' in data) {
      localStorage.setItem('sales', JSON.stringify(data.sales));
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(data.sales));
    }
    
    if ('inventory' in data) {
      localStorage.setItem('inventory', JSON.stringify(data.inventory));
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(data.inventory));
    }
    
    if ('agents' in data) {
      localStorage.setItem('agents', JSON.stringify(data.agents));
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(data.agents));
    }
    
    if ('suppliers' in data) {
      localStorage.setItem('suppliers', JSON.stringify(data.suppliers));
      localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(data.suppliers));
    }
    
    if ('customers' in data) {
      localStorage.setItem('customers', JSON.stringify(data.customers));
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(data.customers));
    }
    
    if ('brokers' in data) {
      localStorage.setItem('brokers', JSON.stringify(data.brokers));
      localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(data.brokers));
    }
    
    if ('transporters' in data) {
      localStorage.setItem('transporters', JSON.stringify(data.transporters));
      localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(data.transporters));
    }
    
    if ('ledger' in data) localStorage.setItem('ledger', JSON.stringify(data.ledger));
    
    if ('payments' in data) {
      localStorage.setItem('payments', JSON.stringify(data.payments));
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(data.payments));
    }
    
    if ('receipts' in data) {
      localStorage.setItem('receipts', JSON.stringify(data.receipts));
      localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(data.receipts));
    }
    
    if ('cashbook' in data) localStorage.setItem(CASHBOOK_STORAGE_KEY, JSON.stringify(data.cashbook));
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Seed initial data function
export const seedInitialData = (force = false) => {
  // Check if data already exists
  const purchases = getPurchases();
  const inventory = getInventory();
  
  // If data exists and force is false, do nothing
  if (!force && purchases.length > 0 && inventory.length > 0) {
    return;
  }
  
  // Completely clear all data first if force is true
  if (force) {
    clearAllData();
  }
  
  // Initialize empty arrays for all data types
  localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem('ledger', JSON.stringify([]));
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify([]));
  
  // For backward compatibility
  localStorage.setItem('purchases', JSON.stringify([]));
  localStorage.setItem('sales', JSON.stringify([]));
  localStorage.setItem('inventory', JSON.stringify([]));
  localStorage.setItem('payments', JSON.stringify([]));
  localStorage.setItem('receipts', JSON.stringify([]));
  
  // Seed some basic agents, suppliers, etc. for testing
  const agents = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      address: 'Mumbai',
      balance: 0
    },
    {
      id: '2',
      name: 'Sunil Patel',
      address: 'Ahmedabad',
      balance: 0
    }
  ];
  
  const suppliers = [
    {
      id: '1',
      name: 'Krishna Suppliers',
      address: 'Rajkot',
      balance: 0
    },
    {
      id: '2',
      name: 'Agro Farms',
      address: 'Surat',
      balance: 0
    }
  ];
  
  const seedCustomers = [
    {
      id: '1',
      name: 'Mumbai Traders',
      address: 'Mumbai',
      balance: 0
    },
    {
      id: '2',
      name: 'Super Market Chain',
      address: 'Pune',
      balance: 0
    }
  ];
  
  const brokers = [
    {
      id: '1',
      name: 'Mohan Broker',
      address: 'Mumbai',
      commissionRate: 1, // Default 1%
      balance: 0
    }
  ];
  
  const transporters = [
    {
      id: '1',
      name: 'Fast Logistics',
      address: 'Ahmedabad',
      balance: 0
    }
  ];
  
  localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
  localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(suppliers));
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(seedCustomers));
  localStorage.setItem(BROKERS_STORAGE_KEY, JSON.stringify(brokers));
  localStorage.setItem(TRANSPORTERS_STORAGE_KEY, JSON.stringify(transporters));
  
  // For backward compatibility
  localStorage.setItem('agents', JSON.stringify(agents));
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
  localStorage.setItem('customers', JSON.stringify(seedCustomers));
  localStorage.setItem('brokers', JSON.stringify(brokers));
  localStorage.setItem('transporters', JSON.stringify(transporters));
  
  // Add MST customer if it doesn't exist
  const currentCustomers = getCustomers();
  if (!currentCustomers.some(c => c.name === "MST")) {
    addCustomer({
      id: 'customer-mst-001',
      name: 'MST',
      address: 'Mumbai',
      balance: 0
    });
  }
};

// This function completely clears all data
export const clearAllData = () => {
  try {
    // Clear both old and new storage keys
    localStorage.removeItem(PURCHASES_STORAGE_KEY);
    localStorage.removeItem(SALES_STORAGE_KEY);
    localStorage.removeItem(INVENTORY_STORAGE_KEY);
    localStorage.removeItem(PAYMENTS_STORAGE_KEY);
    localStorage.removeItem(RECEIPTS_STORAGE_KEY);
    localStorage.removeItem(AGENTS_STORAGE_KEY);
    localStorage.removeItem(BROKERS_STORAGE_KEY);
    localStorage.removeItem(CUSTOMERS_STORAGE_KEY);
    localStorage.removeItem(TRANSPORTERS_STORAGE_KEY);
    localStorage.removeItem(CASHBOOK_STORAGE_KEY);
    localStorage.removeItem(SUPPLIERS_STORAGE_KEY);
    
    // Also clear old keys for backward compatibility
    localStorage.removeItem('purchases');
    localStorage.removeItem('sales');
    localStorage.removeItem('inventory');
    localStorage.removeItem('payments');
    localStorage.removeItem('receipts');
    localStorage.removeItem('agents');
    localStorage.removeItem('suppliers');
    localStorage.removeItem('customers');
    localStorage.removeItem('brokers');
    localStorage.removeItem('transporters');
    localStorage.removeItem('cashbook');
    localStorage.removeItem('ledger');
    localStorage.removeItem('app_deleted_purchases');
    localStorage.removeItem('app_deleted_sales');
    
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
