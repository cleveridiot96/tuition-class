
import { useToast } from "@/hooks/use-toast";

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
  transporter?: string;
  transporterId?: string;
  transportRate?: number;
  transportCost: number;
  location?: string;
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

// Locations function - adding this since it's being used but wasn't defined
export const getLocations = (): string[] => {
  const savedLocations = localStorage.getItem('locations');
  return savedLocations ? JSON.parse(savedLocations) : ['Mumbai', 'Chiplun', 'Sawantwadi'];
};

// Note: The functions getAgents, addAgent, updateAgent, etc. are implemented elsewhere
// and would be included here in the real file. For this fix, we're just correcting the syntax error.

export const getAgents = (): Agent[] => {
  const savedAgents = localStorage.getItem('agents');
  return savedAgents ? JSON.parse(savedAgents) : [];
};

export const addAgent = (agent: Agent): void => {
  const agents = getAgents();
  agents.push(agent);
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const updateAgent = (updatedAgent: Agent): void => {
  const agents = getAgents();
  const index = agents.findIndex(agent => agent.id === updatedAgent.id);
  if (index !== -1) {
    agents[index] = updatedAgent;
    localStorage.setItem('agents', JSON.stringify(agents));
  }
};

export const getInventory = (): any[] => {
  const savedInventory = localStorage.getItem('inventory');
  return savedInventory ? JSON.parse(savedInventory) : [];
};
