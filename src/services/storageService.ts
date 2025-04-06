
// Types for our data models
export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  agent: string;
  party?: string;
  location: string;
  netWeight: number;
  rate: number;
  transporter?: string;
  totalAmount: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
  notes: string;
  isReturn?: boolean;
}

export interface Sale {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  customer: string;
  broker: string;
  amount: number;
  paymentType: "full" | "partial" | "cash";
  paymentReceived: number;
  netWeight?: number;
  notes: string;
  isReturn?: boolean;
}

export interface Agent {
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

export interface Supplier {
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

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
  netWeight?: number;
}

// Storage keys
const STORAGE_KEYS = {
  PURCHASES: 'kks_purchases',
  AGENTS: 'kks_agents',
  INVENTORY: 'kks_inventory',
  SALES: 'kks_sales',
  PAYMENTS: 'kks_payments',
  RECEIPTS: 'kks_receipts',
  TRANSPORTS: 'kks_transports',
  LEDGER_ENTRIES: 'kks_ledger_entries',
  CUSTOMERS: 'kks_customers',
  SUPPLIERS: 'kks_suppliers',
  BROKERS: 'kks_brokers',
  TRANSPORTERS: 'kks_transporters'
};

// Generic get function
const getItems = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error retrieving ${key} data:`, error);
    return [];
  }
};

// Generic save function
const saveItems = <T>(key: string, items: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving ${key} data:`, error);
    alert(`डेटा सहेजने में समस्या (Error saving data)`);
  }
};

// Purchase functions
export const getPurchases = (): Purchase[] => getItems<Purchase>(STORAGE_KEYS.PURCHASES);
export const savePurchases = (purchases: Purchase[]): void => saveItems(STORAGE_KEYS.PURCHASES, purchases);

export const addPurchase = (purchase: Purchase): void => {
  const purchases = getPurchases();
  purchases.unshift(purchase); // Add to beginning of array
  savePurchases(purchases);
  
  // Only add to inventory if it's not a return
  if (!purchase.isReturn) {
    // Add a ledger entry for the agent/party
    if (purchase.agent) {
      addLedgerEntry({
        id: Date.now().toString() + "-ledger",
        date: purchase.date,
        partyName: purchase.agent,
        partyType: "agent",
        description: `Purchase lot ${purchase.lotNumber}`,
        debit: purchase.totalAfterExpenses,
        credit: 0,
        balance: -purchase.totalAfterExpenses,
        relatedDocId: purchase.id,
        type: "purchase"
      });
    }
    
    // Add to inventory
    addInventoryItem({
      id: Date.now().toString() + '-inv',
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      location: purchase.location,
      dateAdded: purchase.date,
      netWeight: purchase.netWeight
    });
  } else {
    // If it's a return, reduce from inventory
    updateInventoryQuantity(purchase.lotNumber, purchase.location, -purchase.quantity);
    
    // Add a ledger entry for the purchase return
    if (purchase.agent) {
      addLedgerEntry({
        id: Date.now().toString() + "-return-ledger",
        date: purchase.date,
        partyName: purchase.agent,
        partyType: "agent",
        description: `Return of lot ${purchase.lotNumber}`,
        debit: 0,
        credit: purchase.totalAfterExpenses,
        balance: purchase.totalAfterExpenses,
        relatedDocId: purchase.id,
        type: "purchase_return"
      });
    }
  }
  
  // Also add for transporter if specified
  if (purchase.transporter) {
    addLedgerEntry({
      id: Date.now().toString() + "-transport-ledger",
      date: purchase.date,
      partyName: purchase.transporter,
      partyType: "transporter",
      description: `Transport for lot ${purchase.lotNumber}`,
      debit: 0, // You might want to specify the transport cost separately
      credit: 0,
      balance: 0,
      relatedDocId: purchase.id,
      type: "transport"
    });
  }
};

export const checkDuplicateLot = (lotNumber: string): Purchase | null => {
  const purchases = getPurchases();
  const duplicate = purchases.find(p => p.lotNumber.toLowerCase() === lotNumber.toLowerCase());
  return duplicate || null;
};

// Sales functions
export const getSales = (): Sale[] => getItems<Sale>(STORAGE_KEYS.SALES);
export const saveSales = (sales: Sale[]): void => saveItems(STORAGE_KEYS.SALES, sales);

export const addSale = (sale: Sale): void => {
  const sales = getSales();
  sales.unshift(sale); // Add to beginning of array
  saveSales(sales);
  
  // Only subtract from inventory if it's not a return
  if (!sale.isReturn) {
    // Subtract from inventory
    const inventory = getInventory();
    const availableLots = inventory.filter(item => item.lotNumber === sale.lotNumber);
    
    let remainingQuantity = sale.quantity;
    
    for (const lot of availableLots) {
      if (remainingQuantity <= 0) break;
      
      const quantityToDeduct = Math.min(lot.quantity, remainingQuantity);
      updateInventoryQuantity(lot.lotNumber, lot.location, -quantityToDeduct);
      remainingQuantity -= quantityToDeduct;
    }
    
    // Add a ledger entry for the customer
    addLedgerEntry({
      id: Date.now().toString() + "-sale-ledger",
      date: sale.date,
      partyName: sale.customer,
      partyType: "customer",
      description: `Sale of lot ${sale.lotNumber}`,
      debit: 0,
      credit: sale.amount,
      balance: sale.amount,
      relatedDocId: sale.id,
      type: "sale"
    });
    
    // If there's a broker, add entry for them too
    if (sale.broker) {
      addLedgerEntry({
        id: Date.now().toString() + "-broker-ledger",
        date: sale.date,
        partyName: sale.broker,
        partyType: "broker",
        description: `Brokerage for lot ${sale.lotNumber}`,
        debit: 0,
        credit: 0, // Should calculate brokerage amount
        balance: 0,
        relatedDocId: sale.id,
        type: "brokerage"
      });
    }
  } else {
    // If it's a return, add back to inventory
    addInventoryItem({
      id: Date.now().toString() + '-return-inv',
      lotNumber: sale.lotNumber,
      quantity: sale.quantity,
      location: "Returns", // Default location for returns
      dateAdded: sale.date,
      netWeight: sale.netWeight
    });
    
    // Add a ledger entry for the sale return
    addLedgerEntry({
      id: Date.now().toString() + "-sale-return-ledger",
      date: sale.date,
      partyName: sale.customer,
      partyType: "customer",
      description: `Return of lot ${sale.lotNumber}`,
      debit: sale.amount,
      credit: 0,
      balance: -sale.amount,
      relatedDocId: sale.id,
      type: "sale_return"
    });
  }
};

export const checkInventoryForLot = (lotNumber: string): InventoryItem[] => {
  const inventory = getInventory();
  return inventory.filter(item => item.lotNumber === lotNumber && item.quantity > 0);
};

export const getAvailableLots = (): string[] => {
  const inventory = getInventory();
  const uniqueLots = new Set<string>();
  
  inventory.forEach(item => {
    if (item.quantity > 0) {
      uniqueLots.add(item.lotNumber);
    }
  });
  
  return Array.from(uniqueLots);
};

// Agent functions
export const getAgents = (): Agent[] => getItems<Agent>(STORAGE_KEYS.AGENTS);
export const saveAgents = (agents: Agent[]): void => saveItems(STORAGE_KEYS.AGENTS, agents);
export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  saveAgents(agents);
};
export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    saveAgents(agents);
  }
};
export const deleteAgent = (agentId: string): void => {
  const agents = getAgents();
  const filteredAgents = agents.filter(a => a.id !== agentId);
  saveAgents(filteredAgents);
};
export const updateAgentBalance = (agentId: string, amount: number): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(a => a.id === agentId);
  if (agentIndex !== -1) {
    agents[agentIndex].balance += amount;
    saveAgents(agents);
  }
};

// Customer functions
export const getCustomers = (): Customer[] => getItems<Customer>(STORAGE_KEYS.CUSTOMERS);
export const saveCustomers = (customers: Customer[]): void => saveItems(STORAGE_KEYS.CUSTOMERS, customers);
export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  saveCustomers(customers);
};
export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    saveCustomers(customers);
  }
};
export const deleteCustomer = (customerId: string): void => {
  const customers = getCustomers();
  const filteredCustomers = customers.filter(c => c.id !== customerId);
  saveCustomers(filteredCustomers);
};

// Supplier functions
export const getSuppliers = (): Supplier[] => getItems<Supplier>(STORAGE_KEYS.SUPPLIERS);
export const saveSuppliers = (suppliers: Supplier[]): void => saveItems(STORAGE_KEYS.SUPPLIERS, suppliers);
export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveSuppliers(suppliers);
};
export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    saveSuppliers(suppliers);
  }
};
export const deleteSupplier = (supplierId: string): void => {
  const suppliers = getSuppliers();
  const filteredSuppliers = suppliers.filter(s => s.id !== supplierId);
  saveSuppliers(suppliers);
};

// Broker functions
export const getBrokers = (): Broker[] => getItems<Broker>(STORAGE_KEYS.BROKERS);
export const saveBrokers = (brokers: Broker[]): void => saveItems(STORAGE_KEYS.BROKERS, brokers);
export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  saveBrokers(brokers);
};
export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(b => b.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    saveBrokers(brokers);
  }
};
export const deleteBroker = (brokerId: string): void => {
  const brokers = getBrokers();
  const filteredBrokers = brokers.filter(b => b.id !== brokerId);
  saveBrokers(filteredBrokers);
};

// Transporter functions
export const getTransporters = (): Transporter[] => getItems<Transporter>(STORAGE_KEYS.TRANSPORTERS);
export const saveTransporters = (transporters: Transporter[]): void => saveItems(STORAGE_KEYS.TRANSPORTERS, transporters);
export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveTransporters(transporters);
};
export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(t => t.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    saveTransporters(transporters);
  }
};
export const deleteTransporter = (transporterId: string): void => {
  const transporters = getTransporters();
  const filteredTransporters = transporters.filter(t => t.id !== transporterId);
  saveTransporters(filteredTransporters);
};

// Interface for ledger entries to track all transactions
export interface LedgerEntry {
  id: string;
  date: string;
  partyName: string;
  partyType: "agent" | "customer" | "transporter" | "broker" | "supplier";
  description: string;
  debit: number;
  credit: number;
  balance: number;
  relatedDocId: string;
  type: "purchase" | "purchase_return" | "sale" | "sale_return" | "payment" | "receipt" | "transport" | "brokerage";
}

// Ledger functions
export const getLedgerEntries = (): LedgerEntry[] => getItems<LedgerEntry>(STORAGE_KEYS.LEDGER_ENTRIES);
export const saveLedgerEntries = (entries: LedgerEntry[]): void => saveItems(STORAGE_KEYS.LEDGER_ENTRIES, entries);
export const addLedgerEntry = (entry: LedgerEntry): void => {
  const entries = getLedgerEntries();
  
  // Calculate current balance for this party
  const partyEntries = entries.filter(e => 
    e.partyName === entry.partyName && 
    e.partyType === entry.partyType
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let currentBalance = 0;
  if (partyEntries.length > 0) {
    currentBalance = partyEntries[partyEntries.length - 1].balance;
  }
  
  // Update the balance
  entry.balance = currentBalance + entry.credit - entry.debit;
  
  entries.push(entry);
  saveLedgerEntries(entries);
};

export const getLedgerEntriesByParty = (partyName: string, partyType: string): LedgerEntry[] => {
  const entries = getLedgerEntries();
  return entries.filter(e => e.partyName === partyName && e.partyType === partyType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Inventory functions
export const getInventory = (): InventoryItem[] => getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
export const saveInventory = (items: InventoryItem[]): void => saveItems(STORAGE_KEYS.INVENTORY, items);
export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
};

export const getInventoryByLocation = (location: string): InventoryItem[] => {
  const inventory = getInventory();
  return inventory.filter(item => item.location === location);
};

export const updateInventoryQuantity = (lotNumber: string, location: string, quantityChange: number): boolean => {
  const inventory = getInventory();
  const itemIndex = inventory.findIndex(i => 
    i.lotNumber === lotNumber && i.location === location
  );
  
  if (itemIndex === -1) {
    return false;
  }
  
  inventory[itemIndex].quantity += quantityChange;
  saveInventory(inventory);
  return true;
};

export const checkInventoryAvailability = (lotNumber: string, quantity: number): boolean => {
  const inventory = getInventory();
  const totalAvailable = inventory
    .filter(i => i.lotNumber === lotNumber)
    .reduce((sum, item) => sum + item.quantity, 0);
    
  return totalAvailable >= quantity;
};

// Function to export all data as a JSON file for backup
export const exportDataBackup = (): void => {
  const data = {
    purchases: getPurchases(),
    agents: getAgents(),
    inventory: getInventory(),
    sales: getSales(),
    payments: getItems(STORAGE_KEYS.PAYMENTS),
    receipts: getItems(STORAGE_KEYS.RECEIPTS),
    transports: getItems(STORAGE_KEYS.TRANSPORTS),
    ledgerEntries: getLedgerEntries(),
    customers: getCustomers(),
    suppliers: getSuppliers(),
    brokers: getBrokers(),
    transporters: getTransporters()
  };
  
  const dataStr = JSON.stringify(data);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const date = new Date().toISOString().split('T')[0];
  const exportFileDefaultName = `kisan_khata_backup_${date}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  // Also export as CSV for Excel compatibility
  exportToExcel(data);
};

// Function to export data to Excel-compatible CSV format
const exportToExcel = (data: any): void => {
  // Define CSV headers and create CSV content for each data type
  const exportPurchases = () => {
    const headers = [
      "Date", "Lot Number", "Quantity", "Agent", "Party", "Location", 
      "Net Weight (kg)", "Rate", "Total Amount", "Expenses", 
      "Total After Expenses", "Rate/Kg After Expenses", "Notes", "Is Return"
    ];
    
    const csvContent = data.purchases.map((p: Purchase) => [
      p.date, p.lotNumber, p.quantity, p.agent, p.party || "", p.location,
      p.netWeight, p.rate, p.totalAmount, p.expenses,
      p.totalAfterExpenses, p.ratePerKgAfterExpenses, p.notes, p.isReturn ? "Yes" : "No"
    ]);
    
    return [headers, ...csvContent];
  };
  
  const exportSales = () => {
    const headers = [
      "Date", "Lot Number", "Quantity", "Customer", "Broker", 
      "Amount", "Payment Type", "Payment Received", "Notes", "Is Return"
    ];
    
    const csvContent = data.sales.map((s: Sale) => [
      s.date, s.lotNumber, s.quantity, s.customer, s.broker || "",
      s.amount, s.paymentType, s.paymentReceived, s.notes, s.isReturn ? "Yes" : "No"
    ]);
    
    return [headers, ...csvContent];
  };
  
  const purchasesCSV = convertToCSV(exportPurchases());
  downloadCSV(purchasesCSV, "purchases");
  
  const salesCSV = convertToCSV(exportSales());
  downloadCSV(salesCSV, "sales");
  
  // Export inventory
  const inventoryHeaders = ["Lot Number", "Quantity", "Location", "Date Added", "Net Weight"];
  const inventoryData = data.inventory.map((i: InventoryItem) => [
    i.lotNumber, i.quantity, i.location, i.dateAdded, i.netWeight || ""
  ]);
  
  const inventoryCSV = convertToCSV([inventoryHeaders, ...inventoryData]);
  downloadCSV(inventoryCSV, "inventory");
  
  // Export ledger
  const ledgerHeaders = ["Date", "Party Name", "Party Type", "Description", "Debit", "Credit", "Balance", "Type"];
  const ledgerData = data.ledgerEntries.map((l: LedgerEntry) => [
    l.date, l.partyName, l.partyType, l.description, l.debit, l.credit, l.balance, l.type
  ]);
  
  const ledgerCSV = convertToCSV([ledgerHeaders, ...ledgerData]);
  downloadCSV(ledgerCSV, "ledger");
};

// Helper function to convert array to CSV
const convertToCSV = (arr: any[][]): string => {
  return arr.map(row => 
    row.map(value => 
      `"${String(value).replace(/"/g, '""')}"`
    ).join(',')
  ).join('\n');
};

// Helper function to download CSV
const downloadCSV = (csvContent: string, fileName: string): void => {
  const date = new Date().toISOString().split('T')[0];
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `kks_${fileName}_${date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to import data from a backup JSON file
export const importDataBackup = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data.purchases || !data.agents || !data.inventory) {
      throw new Error("Invalid backup file format");
    }
    
    // Save each data type
    saveItems(STORAGE_KEYS.PURCHASES, data.purchases);
    saveItems(STORAGE_KEYS.AGENTS, data.agents);
    saveItems(STORAGE_KEYS.INVENTORY, data.inventory);
    if (data.sales) saveItems(STORAGE_KEYS.SALES, data.sales);
    if (data.payments) saveItems(STORAGE_KEYS.PAYMENTS, data.payments);
    if (data.receipts) saveItems(STORAGE_KEYS.RECEIPTS, data.receipts);
    if (data.transports) saveItems(STORAGE_KEYS.TRANSPORTS, data.transports);
    if (data.ledgerEntries) saveItems(STORAGE_KEYS.LEDGER_ENTRIES, data.ledgerEntries);
    if (data.customers) saveItems(STORAGE_KEYS.CUSTOMERS, data.customers);
    if (data.suppliers) saveItems(STORAGE_KEYS.SUPPLIERS, data.suppliers);
    if (data.brokers) saveItems(STORAGE_KEYS.BROKERS, data.brokers);
    if (data.transporters) saveItems(STORAGE_KEYS.TRANSPORTERS, data.transporters);
    
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// Seed initial data if storage is empty
export const seedInitialData = (): void => {
  // Only seed if no data exists
  if (getAgents().length === 0) {
    const agents: Agent[] = [
      {
        id: "1",
        name: "Arvind",
        contactNumber: "9876543210",
        address: "Chiplun",
        balance: 25000
      },
      {
        id: "2",
        name: "Ramesh",
        contactNumber: "8765432109",
        address: "Mumbai",
        balance: -10000
      },
      {
        id: "3",
        name: "Suresh",
        contactNumber: "7654321098",
        address: "Sawantwadi",
        balance: 5000
      }
    ];
    saveAgents(agents);
  }

  if (getInventory().length === 0) {
    const inventory: InventoryItem[] = [
      {
        id: "1",
        lotNumber: "AB/10",
        quantity: 7,
        location: "Chiplun",
        dateAdded: "2025-04-01",
        netWeight: 350
      },
      {
        id: "2",
        lotNumber: "CD/5",
        quantity: 3,
        location: "Mumbai",
        dateAdded: "2025-04-02",
        netWeight: 150
      },
      {
        id: "3",
        lotNumber: "EF/8",
        quantity: 5,
        location: "Chiplun",
        dateAdded: "2025-04-03",
        netWeight: 250
      },
      {
        id: "4",
        lotNumber: "GH/12",
        quantity: 8,
        location: "Mumbai",
        dateAdded: "2025-04-05",
        netWeight: 400
      }
    ];
    saveInventory(inventory);
  }

  // Seed customers if needed
  if (getCustomers().length === 0) {
    const customers: Customer[] = [
      {
        id: "1",
        name: "ABC Trading",
        contactNumber: "9876543210",
        address: "Mumbai",
        balance: 0
      },
      {
        id: "2",
        name: "XYZ Enterprises",
        contactNumber: "8765432109",
        address: "Pune",
        balance: 0
      }
    ];
    saveCustomers(customers);
  }

  // Seed suppliers if needed
  if (getSuppliers().length === 0) {
    const suppliers: Supplier[] = [
      {
        id: "1",
        name: "Farmer Group A",
        contactNumber: "7654321098",
        address: "Satara",
        balance: 0
      },
      {
        id: "2",
        name: "Local Producers",
        contactNumber: "6543210987",
        address: "Kolhapur",
        balance: 0
      }
    ];
    saveSuppliers(suppliers);
  }
};
