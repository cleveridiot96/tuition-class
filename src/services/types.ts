
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
}

export interface Broker extends BaseEntity {
  contactNumber?: string;
  address?: string;
  commissionRate?: number;
  notes?: string;
}

export interface Customer extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  creditLimit?: number;
  notes?: string;
  payableByCustomer?: boolean;
}

export interface Supplier extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
}

export interface Transporter extends BaseEntity {
  contactNumber?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
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
  partyId?: string;
  partyName?: string;
  partyType?: string;
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface StockOpeningBalance {
  id: string;
  name: string;
  lotNumber?: string;
  quantity: number;
  location: string;
  rate: number;
  netWeight: number;
  amount: number;
  balanceType: 'debit' | 'credit';
}

export interface OpeningBalance {
  id: string;
  yearId?: string;
  cash: number;
  bank: number;
  stock: StockOpeningBalance[];
  parties: PartyOpeningBalance[];
}

// For backwards compatibility - exportDataBackup functions
export interface BackupData {
  data: Record<string, any>;
  timestamp: number;
}
