
import { v4 as uuidv4 } from "uuid";
import { saveStorageItem, getStorageItem } from "../storageUtils";

// Supplier operations
export const getSuppliers = () => {
  try {
    const suppliers = getStorageItem<any[]>('suppliers') || [];
    console.log("Retrieved suppliers from storage:", suppliers.length);
    return suppliers;
  } catch (error) {
    console.error("Error getting suppliers:", error);
    return [];
  }
};

export const addSupplier = (supplier: any) => {
  try {
    // Ensure supplier has an ID
    if (!supplier.id) {
      supplier.id = `supplier-${uuidv4()}`;
    }
    
    const suppliers = getSuppliers();
    suppliers.push(supplier);
    saveStorageItem('suppliers', suppliers);
    console.log("Added supplier:", supplier);
    return supplier;
  } catch (error) {
    console.error("Error adding supplier:", error);
    return null;
  }
};

// Add some basic suppliers if none exist
export const ensureSampleSuppliers = () => {
  const suppliers = getSuppliers();
  if (suppliers.length === 0) {
    console.log("Adding sample suppliers");
    addSupplier({
      id: `supplier-${uuidv4()}`,
      name: "Sample Supplier 1",
      address: "Mumbai",
      isDeleted: false,
      createdAt: new Date().toISOString()
    });
    addSupplier({
      id: `supplier-${uuidv4()}`,
      name: "Sample Supplier 2",
      address: "Delhi",
      isDeleted: false,
      createdAt: new Date().toISOString()
    });
  }
};

// Customer operations
export const getCustomers = () => {
  try {
    const customers = getStorageItem<any[]>('customers') || [];
    console.log("Retrieved customers from storage:", customers.length);
    return customers;
  } catch (error) {
    console.error("Error getting customers:", error);
    return [];
  }
};

export const addCustomer = (customer: any) => {
  try {
    // Ensure customer has an ID
    if (!customer.id) {
      customer.id = `customer-${uuidv4()}`;
    }
    
    const customers = getCustomers();
    customers.push(customer);
    saveStorageItem('customers', customers);
    console.log("Added customer:", customer);
    return customer;
  } catch (error) {
    console.error("Error adding customer:", error);
    return null;
  }
};

// Broker operations
export const getBrokers = () => {
  try {
    return getStorageItem<any[]>('brokers') || [];
  } catch (error) {
    console.error("Error getting brokers:", error);
    return [];
  }
};

export const addBroker = (broker: any) => {
  try {
    const brokers = getBrokers();
    brokers.push(broker);
    saveStorageItem('brokers', brokers);
    return broker;
  } catch (error) {
    console.error("Error adding broker:", error);
    return null;
  }
};

// Agent operations
export const getAgents = () => {
  try {
    return getStorageItem<any[]>('agents') || [];
  } catch (error) {
    console.error("Error getting agents:", error);
    return [];
  }
};

export const addAgent = (agent: any) => {
  try {
    // Ensure agent has an ID
    if (!agent.id) {
      agent.id = `agent-${uuidv4()}`;
    }
    
    const agents = getAgents();
    agents.push(agent);
    saveStorageItem('agents', agents);
    console.log("Added agent:", agent);
    return agent;
  } catch (error) {
    console.error("Error adding agent:", error);
    return null;
  }
};

// Transporter operations
export const getTransporters = () => {
  try {
    return getStorageItem<any[]>('transporters') || [];
  } catch (error) {
    console.error("Error getting transporters:", error);
    return [];
  }
};

export const addTransporter = (transporter: any) => {
  try {
    // Ensure transporter has an ID
    if (!transporter.id) {
      transporter.id = `transporter-${uuidv4()}`;
    }
    
    const transporters = getTransporters();
    transporters.push(transporter);
    saveStorageItem('transporters', transporters);
    console.log("Added transporter:", transporter);
    return transporter;
  } catch (error) {
    console.error("Error adding transporter:", error);
    return null;
  }
};

// Master operations
export const getMasters = () => {
  try {
    return getStorageItem<any[]>('masters') || [];
  } catch (error) {
    console.error("Error getting masters:", error);
    return [];
  }
};

export const saveMasters = (masters: any[]) => {
  try {
    saveStorageItem('masters', masters);
  } catch (error) {
    console.error("Error saving masters:", error);
  }
};

export const getLocations = () => {
  try {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : ["Mumbai", "Chiplun", "Sawantwadi"];
  } catch (error) {
    console.error("Error getting locations:", error);
    return ["Mumbai", "Chiplun", "Sawantwadi"];
  }
};

// Transaction operations
export const getTransactions = (partyId: string, startDate: string, endDate: string) => {
  const purchases = getStorageItem<any[]>('purchases') || [];
  const sales = getStorageItem<any[]>('sales') || [];
  const payments = getStorageItem<any[]>('payments') || [];
  
  const transactions = [];
  
  // Add purchases
  for (const purchase of purchases) {
    if ((purchase.partyId === partyId || purchase.agentId === partyId) && !purchase.isDeleted) {
      transactions.push({
        ...purchase,
        type: 'purchase',
        amount: purchase.totalAmount
      });
    }
  }
  
  // Add sales
  for (const sale of sales) {
    if ((sale.customerId === partyId || sale.brokerId === partyId) && !sale.isDeleted) {
      transactions.push({
        ...sale,
        type: 'sale',
        amount: sale.totalAmount
      });
    }
  }
  
  // Add payments
  for (const payment of payments) {
    if (payment.partyId === partyId && !payment.isDeleted) {
      transactions.push({
        ...payment,
        type: 'payment',
      });
    }
  }
  
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Initialize sample data function to be called on app startup
export const initializeSampleData = () => {
  ensureSampleSuppliers();
};
