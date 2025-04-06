import { useToast } from "@/hooks/use-toast";

// This file re-exports all functionality from individual service files 
// to maintain compatibility with existing imports

// Types
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
  localStorage.setItem('transporters', JSON.stringify(updatedTransporters));
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
  
  // Update inventory
  updateInventoryAfterPurchase(purchase);
};

export const updatePurchase = (updatedPurchase: Purchase): void => {
  const purchases = getPurchases();
  const index = purchases.findIndex(p => p.id === updatedPurchase.id);
  
  if (index !== -1) {
    // Get old purchase to update inventory correctly
    const oldPurchase = purchases[index];
    
    // Update purchase
    purchases[index] = updatedPurchase;
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    // Update inventory based on changes
    updateInventoryAfterPurchaseEdit(oldPurchase, updatedPurchase);
  }
};

export const deletePurchase = (id: string): void => {
  const purchases = getPurchases();
  const purchaseToDelete = purchases.find(p => p.id === id);
  
  if (purchaseToDelete) {
    // Mark as deleted instead of removing
    const updatedPurchases = purchases.map(p => p.id === id ? { ...p, isDeleted: true } : p);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
    
    // Update inventory - mark related inventory item as deleted
    const inventory = getInventory();
    const updatedInventory = inventory.map(item => {
      if (item.lotNumber === purchaseToDelete.lotNumber) {
        return { ...item, isDeleted: true };
      }
      return item;
    });
    
    saveInventory(updatedInventory);
  }
};

export const savePurchases = (purchases: any[]) => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

export const checkDuplicateLot = (lotNumber: string, excludeId?: string): Purchase | null => {
  const purchases = getPurchases();
  return purchases.find(p => p.lotNumber === lotNumber && (excludeId ? p.id !== excludeId : true)) || null;
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
    // Purchases CSV
    let purchasesCSV = "ID,Date,Lot Number,Quantity,Agent,Party,Location,Net Weight,Rate,Total Amount\n";
    data.purchases.forEach((p: any) => {
      purchasesCSV += `${p.id},${p.date},${p.lotNumber},${p.quantity},${p.agent},${p.party},${p.location},${p.netWeight},${p.rate},${p.totalAmount}\n`;
    });

    // Inventory CSV
    let inventoryCSV = "ID,Lot Number,Quantity,Location,Date Added,Net Weight\n";
    data.inventory.forEach((i: any) => {
      inventoryCSV += `${i.id},${i.lotNumber},${i.quantity},${i.location},${i.dateAdded},${i.netWeight || 0}\n`;
    });

    // Download purchases CSV
    downloadCSV(purchasesCSV, `purchases-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download inventory CSV
    downloadCSV(inventoryCSV, `inventory-backup-${new Date().toISOString().split('T')[0]}.csv`);

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

// Seed initial data function
export const seedInitialData = (force = false) => {
  // Check if data already exists
  const purchases = localStorage.getItem('purchases');
  const inventory = localStorage.getItem('inventory');
  
  // If data exists and force is false, do nothing
  if (!force && purchases && inventory) {
    return;
  }
  
  // Initialize empty arrays for all data types
  localStorage.setItem('purchases', JSON.stringify([]));
  localStorage.setItem('sales', JSON.stringify([]));
  localStorage.setItem('inventory', JSON.stringify([]));
  localStorage.setItem('ledger', JSON.stringify([]));
  
  // Seed some basic agents, suppliers, etc. for testing
  const agents = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      contactNumber: '9876543210',
      address: 'Mumbai',
      balance: 0
    },
    {
      id: '2',
      name: 'Sunil Patel',
      contactNumber: '9876543211',
      address: 'Ahmedabad',
      balance: 0
    }
  ];
  
  const suppliers = [
    {
      id: '1',
      name: 'Krishna Suppliers',
      contactNumber: '9876543212',
      address: 'Rajkot',
      balance: 0
    },
    {
      id: '2',
      name: 'Agro Farms',
      contactNumber: '9876543213',
      address: 'Surat',
      balance: 0
    }
  ];
  
  const customers = [
    {
      id: '1',
      name: 'Mumbai Traders',
      contactNumber: '9876543214',
      address: 'Mumbai',
      balance: 0
    },
    {
      id: '2',
      name: 'Super Market Chain',
      contactNumber: '9876543215',
      address: 'Pune',
      balance: 0
    }
  ];
  
  const brokers = [
    {
      id: '1',
      name: 'Mohan Broker',
      contactNumber: '9876543216',
      address: 'Mumbai',
      balance: 0
    }
  ];
  
  const transporters = [
    {
      id: '1',
      name: 'Fast Logistics',
      contactNumber: '9876543217',
      address: 'Ahmedabad',
      balance: 0
    }
  ];
  
  localStorage.setItem('agents', JSON.stringify(agents));
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
  localStorage.setItem('customers', JSON.stringify(customers));
  localStorage.setItem('brokers', JSON.stringify(brokers));
  localStorage.setItem('transporters', JSON.stringify(transporters));
};
