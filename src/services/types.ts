
// Base entity types
export interface BaseEntity {
  id: string;
  isDeleted?: boolean;
}

export interface Agent extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance: number;
}

export interface Customer extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance: number;
}

export interface Supplier extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance: number;
}

export interface Broker extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  commissionRate?: number;
  balance: number;
}

export interface Transporter extends BaseEntity {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance: number;
}

// Transaction types
export interface Purchase extends BaseEntity {
  date: string;
  lotNumber: string;
  quantity: number;
  party: string;
  netWeight: number;
  rate: number;
  totalAmount: number;
  transporterId?: string;
  transportRate?: number;
  transportCost?: number;
  brokerId?: string;
  broker?: string;
  brokerageType?: string;
  brokerageValue?: number;
  brokerageAmount?: number;
  expenses?: number;
  totalAfterExpenses?: number;
  ratePerKgAfterExpenses?: number;
  notes?: string;
  location?: string;
}

export interface Sale extends BaseEntity {
  date: string;
  lotNumber: string;
  quantity: number;
  customerId: string;
  customer: string;
  netWeight: number;
  rate: number;
  totalAmount: number;
  transporterId?: string;
  transporter?: string;
  transportRate?: number;
  transportCost?: number;
  brokerId?: string;
  broker?: string;
  brokerageType?: string;
  brokerageValue?: number;
  brokerageAmount?: number;
  billNumber?: string;
  billAmount?: number;
  amount?: number;
  notes?: string;
}

export interface Payment extends BaseEntity {
  date: string;
  amount: number;
  partyId: string;
  partyName: string;
  partyType: "supplier" | "transporter" | "broker" | "agent" | "other";
  mode: "cash" | "bank" | "upi" | "other";
  referenceNumber?: string;
  notes?: string;
}

export interface Receipt extends BaseEntity {
  date: string;
  amount: number;
  customerId: string;
  customerName: string;
  mode: "cash" | "bank" | "upi" | "other";
  referenceNumber?: string;
  notes?: string;
}

export interface InventoryItem extends BaseEntity {
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
  netWeight: number;
  remainingQuantity: number;
  purchaseRate: number;
  finalCost: number;
  agentId: string;
  agentName: string;
  date: string;
}

// Enhanced types with calculated fields
export interface EnhancedInventoryItem extends InventoryItem {
  soldQuantity: number;
  soldWeight: number;
  remainingWeight: number;
  totalValue: number;
}

// Multi-item types
export interface MultiSaleItem {
  lotNumber: string;
  quantity: number;
  weight: number;
  rate: number;
  amount: number;
}

export interface MultiPurchaseItem {
  lotNumber: string;
  quantity: number;
  weight: number;
  rate: number;
  amount: number;
}
