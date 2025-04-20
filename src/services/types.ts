
export interface Agent {
  id: string;
  name: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Broker {
  id: string;
  name: string;
  address?: string;
  commissionRate?: number;
  balance: number;
  isDeleted?: boolean;
}

export interface Transporter {
  id: string;
  name: string;
  address?: string;
  balance: number;
  isDeleted?: boolean;
}

export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  partyId?: string;
  party?: string;
  agentId?: string;
  agent?: string;
  quantity: number;
  netWeight: number;
  rate: number;
  totalAmount: number;
  transporterId?: string;
  transporter?: string;
  transportRate?: number;
  transportAmount?: number;
  transportCost?: number;
  brokerId?: string;
  broker?: string;
  brokerageType?: string;
  brokerageValue?: number;
  brokerageAmount?: number;
  expenses?: number;
  totalAfterExpenses: number;
  location: string;
  notes?: string;
  isDeleted?: boolean;
  reference?: string;
}

export interface Sale {
  id: string;
  date: string;
  billNumber?: string;
  lotNumber: string;
  customerId: string;
  customer: string;
  quantity: number;
  netWeight: number;
  rate: number;
  totalAmount: number;
  notes?: string;
  isDeleted?: boolean;
  brokerId?: string;
  broker?: string;
  salesBroker?: string;
  transportCost?: number;
  transporterId?: string;
  transporter?: string;
  billAmount?: number;
  reference?: string;
}

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  netWeight: number;
  rate: number;
  location: string;
  dateAdded: string;
  isDeleted?: boolean;
  // Extended properties from legacy code
  agentId?: string;
  agentName?: string;
  purchaseRate?: number;
  finalCost?: number;
  date?: string;
  remainingQuantity?: number;
  soldQuantity?: number;
  remainingWeight?: number;
}

export interface EnhancedInventoryItem extends InventoryItem {
  purchaseDate?: string;
  buyingRate?: number;
  currentValue?: number;
  ageInDays?: number;
  totalValue?: number;
  agentName?: string;
  remainingQuantity?: number;
  soldQuantity?: number;
  remainingWeight?: number;
  finalCost?: number;
  purchaseRate?: number;
}

export interface Payment {
  id: string;
  date: string | null;
  amount: number;
  partyType: string;
  partyId: string;
  partyName: string;
  paymentMode: string;
  mode?: string; // Legacy support
  paymentMethod?: string; // Legacy support
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  reference?: string; // Legacy support
  notes?: string;
  isAgainstTransaction?: boolean;
  transactionId?: string;
  transactionDetails?: any;
  isOnAccount?: boolean;
  isDeleted?: boolean;
}

export interface Receipt {
  id: string;
  date: string | null;
  amount: number;
  partyType: string;
  partyId: string;
  partyName: string;
  customerName?: string; // Legacy support
  customerId?: string; // Legacy support
  paymentMode: string;
  mode?: string; // Legacy support
  paymentMethod?: string; // Legacy support
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  reference?: string; // Legacy support
  notes?: string;
  isAgainstTransaction?: boolean;
  transactionId?: string;
  transactionDetails?: any;
  isOnAccount?: boolean;
  isDeleted?: boolean;
}
