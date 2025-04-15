
// This is a partial implementation - you'll need to define the full types

export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isSetup: boolean;
}

export interface OpeningBalance {
  id: string;
  yearId: string;
  cash: number;
  bank: number;
  stock: StockOpeningBalance[];
  parties: PartyOpeningBalance[];
}

export interface StockOpeningBalance {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  location: string;
  rate: number;
  netWeight: number;
  amount: number;
  balanceType: 'debit';
}

export interface PartyOpeningBalance {
  id: string;
  name: string;
  type: 'agent' | 'broker' | 'customer' | 'supplier' | 'transporter';
  partyId: string;
  partyName: string;
  partyType: string;
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface Agent {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  rate?: number;
  balance: number;
  isDeleted?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  payableByCustomer?: boolean;
  balance: number;
  isDeleted?: boolean;
}

export interface Broker {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  rate?: number;
  balance: number;
  isDeleted?: boolean;
}

export interface Transporter {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  netWeight: number;
  rate: number;
  totalAmount: number;
  expenses: number;
  totalAfterExpenses: number;
  agent?: string;
  agentId?: string;
  party?: string;
  partyId?: string;
  brokerageRate?: number;
  brokerageAmount?: number;
  brokerageType: "percentage" | "fixed";
  broker?: string;
  brokerId?: string;
  transporter?: string;
  transporterId?: string;
  transportRate?: number;
  transportCost?: number;
  location: string;
  notes?: string;
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
  totalAmount: number;
  transportCost: number; // Making this non-optional
  netAmount: number;
  broker?: string;
  brokerId?: string;
  brokerageRate?: number;
  brokerageAmount?: number;
  brokerageType?: "percentage" | "fixed";
  transporter?: string;
  transporterId?: string;
  transportRate?: number;
  location?: string;
  notes?: string;
  isDeleted?: boolean;
  amount: number;
}

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
  netWeight: number;
  rate: number; // Added rate field
  finalCost?: number;
  remainingQuantity?: number;
  isDeleted?: boolean;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  partyId: string;
  partyName: string;
  partyType: string;
  reference?: string;
  paymentMethod?: string;
  notes?: string;
  isDeleted?: boolean;
  paymentMode?: string;
}

export interface Receipt {
  id: string;
  date: string;
  amount: number;
  customerId: string;
  customerName: string;
  reference?: string;
  paymentMethod?: string;
  notes?: string;
  isDeleted?: boolean;
  paymentMode?: string;
}

export interface EnhancedInventoryItem extends InventoryItem {
  totalValue: number;
  avgRate: number;
}

