
import { Agent, Supplier, Customer, Broker, Transporter } from './types';
import { getStorageItem, saveStorageItem } from './storageUtils';

// Agents
export const getPurchaseAgents = (): Agent[] => {
  return getStorageItem<Agent[]>('agents') || [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getPurchaseAgents();
  agents.push(agent);
  saveStorageItem('agents', agents);
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getPurchaseAgents();
  const index = agents.findIndex(agent => agent.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    saveStorageItem('agents', agents);
  }
};

export const deleteAgent = (id: string): void => {
  const agents = getPurchaseAgents();
  const index = agents.findIndex(agent => agent.id === id);
  if (index !== -1) {
    agents[index] = { ...agents[index], isDeleted: true };
    saveStorageItem('agents', agents);
  }
};

export const updateAgentBalance = (agentId: string, changeAmount: number): void => {
  const agents = getPurchaseAgents();
  const agentIndex = agents.findIndex(agent => agent.id === agentId);
  
  if (agentIndex !== -1) {
    agents[agentIndex].balance = (agents[agentIndex].balance || 0) + changeAmount;
    saveStorageItem('agents', agents);
  }
};

// Suppliers
export const getSuppliers = (): Supplier[] => {
  return getStorageItem<Supplier[]>('suppliers') || [];
};

export const addSupplier = (supplier: Supplier): void => {
  const suppliers = getSuppliers();
  suppliers.push(supplier);
  saveStorageItem('suppliers', suppliers);
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    saveStorageItem('suppliers', suppliers);
  }
};

export const deleteSupplier = (id: string): void => {
  const suppliers = getSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === id);
  if (index !== -1) {
    suppliers[index] = { ...suppliers[index], isDeleted: true };
    saveStorageItem('suppliers', suppliers);
  }
};

// Customers
export const getCustomers = (): Customer[] => {
  return getStorageItem<Customer[]>('customers') || [];
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  saveStorageItem('customers', customers);
};

export const updateCustomer = (updatedCustomer: Customer): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === updatedCustomer.id);
  if (index !== -1) {
    customers[index] = updatedCustomer;
    saveStorageItem('customers', customers);
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  const index = customers.findIndex(customer => customer.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], isDeleted: true };
    saveStorageItem('customers', customers);
  }
};

// Brokers
export const getBrokers = (): Broker[] => {
  return getStorageItem<Broker[]>('brokers') || [];
};

export const addBroker = (broker: Broker): void => {
  const brokers = getBrokers();
  brokers.push(broker);
  saveStorageItem('brokers', brokers);
};

export const updateBroker = (updatedBroker: Broker): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === updatedBroker.id);
  if (index !== -1) {
    brokers[index] = updatedBroker;
    saveStorageItem('brokers', brokers);
  }
};

export const deleteBroker = (id: string): void => {
  const brokers = getBrokers();
  const index = brokers.findIndex(broker => broker.id === id);
  if (index !== -1) {
    brokers[index] = { ...brokers[index], isDeleted: true };
    saveStorageItem('brokers', brokers);
  }
};

// Transporters
export const getTransporters = (): Transporter[] => {
  return getStorageItem<Transporter[]>('transporters') || [];
};

export const addTransporter = (transporter: Transporter): void => {
  const transporters = getTransporters();
  transporters.push(transporter);
  saveStorageItem('transporters', transporters);
};

export const updateTransporter = (updatedTransporter: Transporter): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === updatedTransporter.id);
  if (index !== -1) {
    transporters[index] = updatedTransporter;
    saveStorageItem('transporters', transporters);
  }
};

export const deleteTransporter = (id: string): void => {
  const transporters = getTransporters();
  const index = transporters.findIndex(transporter => transporter.id === id);
  if (index !== -1) {
    transporters[index] = { ...transporters[index], isDeleted: true };
    saveStorageItem('transporters', transporters);
  }
};

// For backward compatibility
export const getAgents = getPurchaseAgents;
export const getSalesBrokers = getBrokers;
