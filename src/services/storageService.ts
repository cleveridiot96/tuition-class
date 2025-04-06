
// Types for our data models
export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  agent: string;
  location: string;
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
}

// Storage keys
const STORAGE_KEYS = {
  PURCHASES: 'kks_purchases',
  AGENTS: 'kks_agents',
  INVENTORY: 'kks_inventory',
  SALES: 'kks_sales',
  PAYMENTS: 'kks_payments',
  TRANSPORTS: 'kks_transports'
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

// Inventory functions
export const getInventory = (): InventoryItem[] => getItems<InventoryItem>(STORAGE_KEYS.INVENTORY);
export const saveInventory = (items: InventoryItem[]): void => saveItems(STORAGE_KEYS.INVENTORY, items);
export const addInventoryItem = (item: InventoryItem): void => {
  const inventory = getInventory();
  inventory.push(item);
  saveInventory(inventory);
};

// Function to export all data as a JSON file for backup
export const exportDataBackup = (): void => {
  const data = {
    purchases: getPurchases(),
    agents: getAgents(),
    inventory: getInventory(),
    sales: getItems(STORAGE_KEYS.SALES),
    payments: getItems(STORAGE_KEYS.PAYMENTS),
    transports: getItems(STORAGE_KEYS.TRANSPORTS)
  };
  
  const dataStr = JSON.stringify(data);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const date = new Date().toISOString().split('T')[0];
  const exportFileDefaultName = `kisan_khata_backup_${date}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
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
        dateAdded: "2025-04-01"
      },
      {
        id: "2",
        lotNumber: "CD/5",
        quantity: 3,
        location: "Mumbai",
        dateAdded: "2025-04-02"
      },
      {
        id: "3",
        lotNumber: "EF/8",
        quantity: 5,
        location: "Chiplun",
        dateAdded: "2025-04-03"
      },
      {
        id: "4",
        lotNumber: "GH/12",
        quantity: 8,
        location: "Mumbai",
        dateAdded: "2025-04-05"
      }
    ];
    saveInventory(inventory);
  }
};
