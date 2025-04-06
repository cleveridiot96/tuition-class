
import { useToast } from "@/hooks/use-toast";

// Define types
export interface Agent {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  balance: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  balance: number;
}

export interface Broker {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  balance: number;
}

export interface Transporter {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  balance: number;
}

export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  agent: string;
  party: string;
  location: string;
  netWeight: number;
  rate: number;
  transporter: string;
  totalAmount: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
  notes: string;
}

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
  netWeight: number;
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

// Agent functions
export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem('agents');
  return agents ? JSON.parse(agents) : [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getAgents();
  const updatedAgents = agents.filter(a => a.id !== id);
  localStorage.setItem('agents', JSON.stringify(updatedAgents));
};

export const updateAgentBalance = (id: string, amount: number): void => {
  const agents = getAgents();
  const agent = agents.find(a => a.id === id);
  if (agent) {
    agent.balance += amount;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

// Supplier functions
export const getSuppliers = (): Supplier[] => {
  const suppliers = localStorage.getItem('suppliers');
  return suppliers ? JSON.parse(suppliers) : [];
};

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const updatedSuppliers = suppliers.filter(s => s.id !== id);
  localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
};

// Customer functions
export const getCustomers = (): Customer[] => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  localStorage.setItem('customers', JSON.stringify(customers));
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    localStorage.setItem('customers', JSON.stringify(customers));
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  const updatedCustomers = customers.filter(c => c.id !== id);
  localStorage.setItem('customers', JSON.stringify(updatedCustomers));
};

// Broker functions
export const getBrokers = (): Broker[] => {
  const brokers = localStorage.getItem('brokers');
  return brokers ? JSON.parse(brokers) : [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  localStorage.setItem('brokers', JSON.stringify(brokers));
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(b => b.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    localStorage.setItem('brokers', JSON.stringify(brokers));
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getBrokers();
  const updatedBrokers = brokers.filter(b => b.id !== id);
  localStorage.setItem('brokers', JSON.stringify(updatedBrokers));
};

// Transporter functions
export const getTransporters = (): Transporter[] => {
  const transporters = localStorage.getItem('transporters');
  return transporters ? JSON.parse(transporters) : [];
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  localStorage.setItem('transporters', JSON.stringify(transporters));
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(t => t.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    localStorage.setItem('transporters', JSON.stringify(transporters));
  }
};

export const deleteTransporter = (id: string): void => {
  const transporters = getTransporters();
  const updatedTransporters = transporters.filter(t => t.id !== id);
  localStorage.setItem('transporters', JSON.stringify(transporters));
};

// Purchase functions
export const getPurchases = () => {
  const purchases = localStorage.getItem('purchases');
  return purchases ? JSON.parse(purchases) : [];
};

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.push(purchase);
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const savePurchases = (purchases: any[]) => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const checkDuplicateLot = (lotNumber: string): Purchase | null => {
  const purchases = getPurchases();
  return purchases.find(p => p.lotNumber === lotNumber) || null;
};

// Sales functions
export const getSales = () => {
  const sales = localStorage.getItem('sales');
  return sales ? JSON.parse(sales) : [];
};

export const saveSales = (sales: any[]) => {
  localStorage.setItem('sales', JSON.stringify(sales));
};

// Inventory functions
export const getInventory = () => {
  const inventory = localStorage.getItem('inventory');
  return inventory ? JSON.parse(inventory) : [];
};

export const saveInventory = (inventory: any[]) => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  localStorage.setItem('inventory', JSON.stringify(inventory));
};

// Ledger functions
export const getLedgerEntries = (): LedgerEntry[] => {
  const entries = localStorage.getItem('ledger');
  return entries ? JSON.parse(entries) : [];
};

export const getLedgerEntriesByParty = (partyName: string, partyType: string): LedgerEntry[] => {
  const entries = getLedgerEntries();
  return entries.filter(entry => entry.partyName === partyName && entry.partyType === partyType);
};

// Modify the exportDataBackup function to accept a silent parameter
export const exportDataBackup = (silent = false) => {
  try {
    const data = {
      purchases: JSON.parse(localStorage.getItem('purchases') || '[]'),
      sales: JSON.parse(localStorage.getItem('sales') || '[]'),
      inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
      agents: JSON.parse(localStorage.getItem('agents') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
      customers: JSON.parse(localStorage.getItem('customers') || '[]'),
      brokers: JSON.parse(localStorage.getItem('brokers') || '[]'),
      transporters: JSON.parse(localStorage.getItem('transporters') || '[]'),
      ledger: JSON.parse(localStorage.getItem('ledger') || '[]'),
      // Add any other data you want to include in the backup
    };

    // Convert data to JSON string
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

    // This is safer than referencing toast directly - we'll tell users to
    // handle toasts in their consuming component
    return jsonData;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const importDataBackup = (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Check if the data object has the required properties
    if (!data || typeof data !== 'object') {
      console.error('Invalid backup data format');
      return false;
    }
    
    // Set each data item in localStorage if present
    if ('purchases' in data) localStorage.setItem('purchases', JSON.stringify(data.purchases));
    if ('sales' in data) localStorage.setItem('sales', JSON.stringify(data.sales));
    if ('inventory' in data) localStorage.setItem('inventory', JSON.stringify(data.inventory));
    if ('agents' in data) localStorage.setItem('agents', JSON.stringify(data.agents));
    if ('suppliers' in data) localStorage.setItem('suppliers', JSON.stringify(data.suppliers));
    if ('customers' in data) localStorage.setItem('customers', JSON.stringify(data.customers));
    if ('brokers' in data) localStorage.setItem('brokers', JSON.stringify(data.brokers));
    if ('transporters' in data) localStorage.setItem('transporters', JSON.stringify(data.transporters));
    if ('ledger' in data) localStorage.setItem('ledger', JSON.stringify(data.ledger));
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Modify seedInitialData to accept a force parameter
export const seedInitialData = (force = false) => {
  // Check if data already exists
  const purchases = localStorage.getItem('purchases');
  const sales = localStorage.getItem('sales');
  const inventory = localStorage.getItem('inventory');
  
  // If force is true or any of the required data is missing, seed the data
  if (force || !purchases || !sales || !inventory) {
    // Seed initial data
    const initialPurchases = [
      {
        id: '1',
        date: '2024-01-01',
        agent: 'Agent A',
        quantity: 50,
        ratePerKg: 250,
        netWeight: 50,
        transportCharges: 1000,
        otherExpenses: 500,
        totalAfterExpenses: 14000
      },
      {
        id: '2',
        date: '2024-01-05',
        agent: 'Agent B',
        quantity: 30,
        ratePerKg: 260,
        netWeight: 30,
        transportCharges: 800,
        otherExpenses: 400,
        totalAfterExpenses: 9000
      },
    ];
    
    const initialSales = [
      {
        id: '101',
        date: '2024-01-10',
        customer: 'Customer X',
        quantity: 20,
        ratePerKg: 300,
        netWeight: 20,
        amount: 6000
      },
      {
        id: '102',
        date: '2024-01-15',
        customer: 'Customer Y',
        quantity: 15,
        ratePerKg: 310,
        netWeight: 15,
        amount: 4650
      },
    ];
    
    const initialInventory = [
      {
        id: '201',
        location: 'Mumbai',
        item: 'Rice',
        quantity: 100
      },
      {
        id: '202',
        location: 'Chiplun',
        item: 'Wheat',
        quantity: 50
      },
      {
        id: '203',
        location: 'Sawantwadi',
        item: 'Sugar',
        quantity: 75
      },
    ];
    
    localStorage.setItem('purchases', JSON.stringify(initialPurchases));
    localStorage.setItem('sales', JSON.stringify(initialSales));
    localStorage.setItem('inventory', JSON.stringify(initialInventory));
    
    // Initialize other collections if they don't exist
    if (!localStorage.getItem('agents')) {
      localStorage.setItem('agents', JSON.stringify([
        { id: '1', name: 'Agent A', contactNumber: '1234567890', address: 'Mumbai', balance: 0 },
        { id: '2', name: 'Agent B', contactNumber: '9876543210', address: 'Chiplun', balance: 0 }
      ]));
    }
    
    if (!localStorage.getItem('customers')) {
      localStorage.setItem('customers', JSON.stringify([
        { id: '1', name: 'Customer X', contactNumber: '5556667777', address: 'Delhi', balance: 0 },
        { id: '2', name: 'Customer Y', contactNumber: '8889990000', address: 'Pune', balance: 0 }
      ]));
    }
    
    if (!localStorage.getItem('suppliers')) {
      localStorage.setItem('suppliers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('brokers')) {
      localStorage.setItem('brokers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('transporters')) {
      localStorage.setItem('transporters', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('ledger')) {
      localStorage.setItem('ledger', JSON.stringify([]));
    }
  }
};
