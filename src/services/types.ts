
// Define common types used across all services

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
