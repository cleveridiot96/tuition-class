
// Common interfaces for all entities
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
  amount: number;
  isDeleted?: boolean;
}

export interface Payment {
  id: string;
  date: string;
  party: string;
  partyId: string;
  partyName?: string;
  partyType?: string;
  amount: number;
  paymentMethod: string;
  paymentMode?: string;
  reference: string;
  notes: string;
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  isDeleted?: boolean;
  isOnAccount?: boolean;
  isAgainstTransaction?: boolean;
  transactionDetails?: {
    type: 'purchase' | 'sale';
    id: string;
    number: string;
  }
}

export interface Receipt {
  id: string;
  date: string;
  customer: string;
  customerId: string;
  customerName?: string;
  amount: number;
  paymentMethod: string;
  paymentMode?: string;
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
  type: "debit" | "credit";
  amount: number;
}
