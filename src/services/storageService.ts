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

export interface Receipt {
  id: string;
  date: string;
  receiptNumber: string;
  partyName: string;
  partyType: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export interface Payment {
  id: string;
  date: string;
  paymentNumber: string;
  agent: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
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
    // Remove from purchases
    const updatedPurchases = purchases.filter(p => p.id !== id);
    localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
    
    // Update inventory
    updateInventoryAfterPurchaseDelete(purchaseToDelete);
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
  return inventory.find(item => item.lotNumber === lotNumber);
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
  } else {
    // Add new item
    inventory.push({
      id: Date.now().toString() + '-inv',
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      location: purchase.location,
      dateAdded: purchase.date,
      netWeight: purchase.netWeight
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
    } else {
      // Lot number changed, need to adjust old item and maybe create new one
      inventory[existingItemIndex].quantity -= oldPurchase.quantity;
      inventory[existingItemIndex].netWeight = 
        (inventory[existingItemIndex].netWeight || 0) - oldPurchase.netWeight;
      
      // If old item has zero quantity, remove it
      if (inventory[existingItemIndex].quantity <= 0) {
        inventory.splice(existingItemIndex, 1);
      }
      
      // Look for the new lot number
      const newItemIndex = inventory.findIndex(item => item.lotNumber === newPurchase.lotNumber);
      if (newItemIndex !== -1) {
        // Update existing new lot
        inventory[newItemIndex].quantity += newPurchase.quantity;
        inventory[newItemIndex].netWeight = 
          (inventory[newItemIndex].netWeight || 0) + newPurchase.netWeight;
      } else {
        // Create new inventory item
        inventory.push({
          id: Date.now().toString() + '-inv',
          lotNumber: newPurchase.lotNumber,
          quantity: newPurchase.quantity,
          location: newPurchase.location,
          dateAdded: newPurchase.date,
          netWeight: newPurchase.netWeight
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
    } else {
      // Create new
      inventory.push({
        id: Date.now().toString() + '-inv',
        lotNumber: newPurchase.lotNumber,
        quantity: newPurchase.quantity,
        location: newPurchase.location,
        dateAdded: newPurchase.date,
        netWeight: newPurchase.netWeight
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
      inventory.splice(existingItemIndex, 1); // Remove item if quantity is zero or negative
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

// Receipt functions
export const getReceipts = (): Receipt[] => {
  const receipts = localStorage.getItem('receipts');
  return receipts ? JSON.parse(receipts) : [];
};

export const addReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));
  
  // Also update the ledger for this receipt
  addLedgerEntry({
    id: Date.now().toString(),
    date: receipt.date,
    partyName: receipt.partyName,
    partyType: receipt.partyType,
    description: `Receipt: ${receipt.receiptNumber}`,
    debit: 0,
    credit: receipt.amount,
    balance: 0, // Will be calculated when retrieved
    referenceId: receipt.id,
    referenceType: 'receipt'
  });

  // If payment method is cash, add to cashbook
  if (receipt.paymentMethod === 'cash') {
    addCashbookEntry(
      receipt.date,
      `Receipt: ${receipt.partyName}`,
      0, // Debit
      receipt.amount, // Credit
      receipt.id,
      'receipt'
    );
  }
};

export const updateReceipt = (updatedReceipt: Receipt): void => {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === updatedReceipt.id);
  if (index !== -1) {
    receipts[index] = updatedReceipt;
    localStorage.setItem('receipts', JSON.stringify(receipts));
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const updatedReceipts = receipts.filter(r => r.id !== id);
  localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
};

// Payment functions
export const getPayments = (): Payment[] => {
  const payments = localStorage.getItem('payments');
  return payments ? JSON.parse(payments) : [];
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  localStorage.setItem('payments', JSON.stringify(payments));
  
  // Also update the ledger for this payment
  addLedgerEntry({
    id: Date.now().toString(),
    date: payment.date,
    partyName: payment.agent,
    partyType: 'agent',
    description: `Payment: ${payment.paymentNumber}`,
    debit: payment.amount,
    credit: 0,
    balance: 0, // Will be calculated when retrieved
    referenceId: payment.id,
    referenceType: 'payment'
  });

  // If payment method is cash, add to cashbook
  if (payment.paymentMethod === 'cash') {
    addCashbookEntry(
      payment.date,
      `Payment: ${payment.agent}`,
      payment.amount, // Debit
      0, // Credit
      payment.id,
      'payment'
    );
  }
};

export const updatePayment = (updatedPayment: Payment): void => {
  const payments = getPayments();
  const index = payments.findIndex(p => p.id === updatedPayment.id);
  if (index !== -1) {
    payments[index] = updatedPayment;
    localStorage.setItem('payments', JSON.stringify(payments));
  }
};

export const deletePayment = (id: string): void => {
  const payments = getPayments();
  const updatedPayments = payments.filter(p => p.id !== id);
  localStorage.setItem('payments', JSON.stringify(updatedPayments));
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
      receipts: JSON.parse(localStorage.getItem('receipts') || '[]'),
      payments: JSON.parse(localStorage.getItem('payments') || '[]'),
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

    // Receipts CSV
    let receiptsCSV = "ID,Date,Receipt Number,Party Name,Party Type,Amount,Payment Method\n";
    data.receipts.forEach((r: any) => {
      receiptsCSV += `${r.id},${r.date},${r.receiptNumber},${r.partyName},${r.partyType},${r.amount},${r.paymentMethod}\n`;
    });

    // Payments CSV
    let paymentsCSV = "ID,Date,Payment Number,Agent,Amount,Payment Method\n";
    data.payments.forEach((p: any) => {
      paymentsCSV += `${p.id},${p.date},${p.paymentNumber},${p.agent},${p.amount},${p.paymentMethod}\n`;
    });

    // Download purchases CSV
    downloadCSV(purchasesCSV, `purchases-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download inventory CSV
    downloadCSV(inventoryCSV, `inventory-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download receipts CSV
    downloadCSV(receiptsCSV, `receipts-backup-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Download payments CSV
    downloadCSV(paymentsCSV, `payments-backup-${new Date().toISOString().split('T')[0]}.csv`);

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
    if ('receipts' in data) localStorage.setItem('receipts', JSON.stringify(data.receipts));
    if ('payments' in data) localStorage.setItem('payments', JSON.stringify(data.payments));
    
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
    // Create a backup first if data exists
    if (purchases || sales || inventory) {
      exportDataBackup(true);
    }
    
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
        lotNumber: 'LOT001',
        location: 'Mumbai',
        quantity: 100,
        dateAdded: '2024-01-01',
        netWeight: 1000
      },
      {
        id: '202',
        lotNumber: 'LOT002',
        location: 'Chiplun',
        quantity: 50,
        dateAdded: '2024-01-05',
        netWeight: 500
      },
      {
        id: '203',
        lotNumber: 'LOT003',
        location: 'Sawantwadi',
        quantity: 75,
        dateAdded: '2024-01-10',
        netWeight: 750
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
      localStorage.setItem('ledger', JSON.stringify([
        {
          id: '1001',
          date: '2024-01-01',
          partyName: 'Agent A',
          partyType: 'agent',
          description: 'Initial transaction',
          debit: 5000,
          credit: 0,
          balance: -5000
        },
        {
          id: '1002',
          date: '2024-01-05',
          partyName: 'Agent B',
          partyType: 'agent',
          description: 'Initial transaction',
          debit: 0,
          credit: 3000,
          balance: 3000
        },
        {
          id: '1003',
          date: '2024-01-10',
          partyName: 'Cash',
          partyType: 'cash',
          description: 'Opening balance',
          debit: 0,
          credit: 10000,
          balance: 10000
        }
      ]));
    }
  }
};
