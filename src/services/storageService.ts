
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
}

export interface Agent {
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
  TRANSPORTS: 'kks_transports',
  LEDGER_ENTRIES: 'kks_ledger_entries'
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

// Agent functions
export const getAgents = (): Agent[] => getItems<Agent>(STORAGE_KEYS.AGENTS);
export const saveAgents = (agents: Agent[]): void => saveItems(STORAGE_KEYS.AGENTS, agents);
export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  saveAgents(agents);
};
export const updateAgentBalance = (agentId: string, amount: number): void => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(a => a.id === agentId);
  if (agentIndex !== -1) {
    agents[agentIndex].balance += amount;
    saveAgents(agents);
  }
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
  type: "purchase" | "sale" | "payment" | "receipt" | "transport";
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

// Inventory functions
export const getInventory = (): InventoryItem[] => getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
export const saveInventory = (items: InventoryItem[]): void => saveItems(STORAGE_KEYS.INVENTORY, items);
export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
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
    sales: getItems(STORAGE_KEYS.SALES),
    payments: getItems(STORAGE_KEYS.PAYMENTS),
    transports: getItems(STORAGE_KEYS.TRANSPORTS),
    ledgerEntries: getLedgerEntries()
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
      "Total After Expenses", "Rate/Kg After Expenses", "Notes"
    ];
    
    const csvContent = data.purchases.map((p: Purchase) => [
      p.date, p.lotNumber, p.quantity, p.agent, p.party || "", p.location,
      p.netWeight, p.rate, p.totalAmount, p.expenses,
      p.totalAfterExpenses, p.ratePerKgAfterExpenses, p.notes
    ]);
    
    return [headers, ...csvContent];
  };
  
  const purchasesCSV = convertToCSV(exportPurchases());
  downloadCSV(purchasesCSV, "purchases");
  
  // Similarly export other data types if needed
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
    if (data.transports) saveItems(STORAGE_KEYS.TRANSPORTS, data.transports);
    if (data.ledgerEntries) saveItems(STORAGE_KEYS.LEDGER_ENTRIES, data.ledgerEntries);
    
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

// Seed initial demo data if storage is empty
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
};
