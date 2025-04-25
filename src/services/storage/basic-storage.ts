
import { v4 as uuidv4 } from "uuid";
import { saveStorageItem, getStorageItem } from "../storageUtils";

// Supplier operations
export const getSuppliers = () => {
  return getStorageItem<any[]>('suppliers') || [];
};

export const addSupplier = (supplier: any) => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
  return supplier;
};

// Customer operations
export const getCustomers = () => {
  return getStorageItem<any[]>('customers') || [];
};

export const addCustomer = (customer: any) => {
  const customers = getCustomers();
  customers.push(customer);
  saveStorageItem('customers', customers);
  return customer;
};

// Broker operations
export const getBrokers = () => {
  return getStorageItem<any[]>('brokers') || [];
};

export const addBroker = (broker: any) => {
  const brokers = getBrokers();
  brokers.push(broker);
  saveStorageItem('brokers', brokers);
  return broker;
};

// Agent operations
export const getAgents = () => {
  return getStorageItem<any[]>('agents') || [];
};

export const addAgent = (agent: any) => {
  const agents = getAgents();
  agents.push(agent);
  saveStorageItem('agents', agents);
  return agent;
};

// Transporter operations
export const getTransporters = () => {
  return getStorageItem<any[]>('transporters') || [];
};

export const addTransporter = (transporter: any) => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveStorageItem('transporters', transporters);
  return transporter;
};

// Master operations
export const getMasters = () => {
  return getStorageItem<any[]>('masters') || [];
};

export const saveMasters = (masters: any[]) => {
  saveStorageItem('masters', masters);
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
