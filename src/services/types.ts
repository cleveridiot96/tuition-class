
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
}

export interface EnhancedInventoryItem extends InventoryItem {
  purchaseDate?: string;
  buyingRate?: number;
  currentValue?: number;
  ageInDays?: number;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  partyType: string;
  partyId: string;
  partyName: string;
  paymentMode: string;
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  notes?: string;
  isAgainstTransaction?: boolean;
  transactionId?: string;
  transactionDetails?: any;
  isOnAccount?: boolean;
  isDeleted?: boolean;
}

export interface Receipt {
  id: string;
  date: string;
  amount: number;
  partyType: string;
  partyId: string;
  partyName: string;
  paymentMode: string;
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  notes?: string;
  isAgainstTransaction?: boolean;
  transactionId?: string;
  transactionDetails?: any;
  isOnAccount?: boolean;
  isDeleted?: boolean;
}
