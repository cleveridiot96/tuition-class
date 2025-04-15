
// Basic entity types
export interface BaseEntity {
  id: string;
  name: string;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface Agent extends BaseEntity {
  contactNumber?: string;
  address?: string;
  commissionRate?: number;
  notes?: string;
  balance?: number; // Added balance property
}

export interface Broker extends BaseEntity {
  contactNumber?: string;
  address?: string;
  commissionRate?: number;
  notes?: string;
  balance?: number; // Added balance property
}

export interface Customer extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  creditLimit?: number;
  notes?: string;
  payableByCustomer?: boolean;
  balance?: number; // Added balance property
}

export interface Supplier extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
  balance?: number; // Added balance property
}

export interface Transporter extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
  balance?: number; // Added balance property
}

export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isSetup: boolean;
}

// Opening balance types
export interface PartyOpeningBalance {
  id: string;
  name: string;
  type: 'agent' | 'broker' | 'customer' | 'supplier' | 'transporter';
  partyId?: string; // Made optional for backward compatibility
  partyName?: string; // Made optional for backward compatibility
  partyType?: string; // Made optional for backward compatibility
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface StockOpeningBalance {
  id: string;
  name: string;
  lotNumber?: string; // Made this optional but must be included
  quantity: number;
  location: string;
  rate: number;
  netWeight?: number; // Made optional
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface OpeningBalance {
  id: string;
  yearId?: string; // Made optional
  cash: number;
  bank: number;
  stock: StockOpeningBalance[];
  parties: PartyOpeningBalance[];
}

// Transaction types
export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  netWeight: number;
  rate: number;
  party: string;
  brokerId?: string;
  broker?: string;
  location: string;
  transporterId: string;
  transporter?: string;
  transportRate: number;
  expenses: number;
  totalAmount: number;
  brokerageType?: "percentage" | "fixed";
  brokerageValue?: number;
  brokerageAmount?: number;
  transportCost?: number;
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
  broker?: string;
  brokerId?: string;
  transporter?: string;
  transporterId?: string;
  transportRate?: number;
  location?: string;
  notes?: string;
  totalAmount: number;
  transportCost?: number;
  netAmount?: number;
  isDeleted?: boolean;
  brokerageAmount?: number;
  amount?: number;
}

export interface Payment {
  id: string;
  date: string;
  partyName: string;
  partyId: string;
  partyType: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  notes?: string;
  isDeleted?: boolean;
}

export interface Receipt {
  id: string;
  date: string;
  partyName: string;
  partyId: string;
  partyType: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
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
  productName?: string;
  isDeleted?: boolean;
}

export interface EnhancedInventoryItem extends InventoryItem {
  totalValue: number;
  averageRate: number;
  locationInfo: string;
}

// For backwards compatibility - exportDataBackup functions
export interface BackupData {
  data: Record<string, any>;
  timestamp: number;
}
