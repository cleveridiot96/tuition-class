// Basic interfaces
export interface BasePurchase {
  id: string;
  date: string;
  lotNumber: string;
  bags: number;
  party: string;
  location: string;
  netWeight: number;
  rate: number;
  quantity: number;
  transporterId?: string;
  transportRate?: number;
  transportCost?: number;
  expenses?: number;
  brokerageType?: string;
  brokerageRate?: number;
  brokerageValue?: number;
  notes?: string;
  agentId?: string;
  agent?: string;
  broker?: string;
  transporter?: string;
  billNumber?: string;
  billAmount?: number;
  isDeleted?: boolean;
  totalAmount: number;
  transportAmount?: number;
  brokerageAmount?: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses?: number;
  items?: Array<{id?: string; name: string; quantity: number; rate: number;}>;
}

export interface Purchase extends BasePurchase {
  partyId?: string;
  brokerName?: string;
  isInventorized?: boolean;
}

export interface SaleItem {
  id: string;
  inventoryItemId: string;
  lotNumber: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  name?: string;
}

export interface Sale {
  id: string;
  date: string;
  lotNumber: string;
  location: string;
  customerId: string;
  customerName?: string;
  customer?: string;
  brokerId?: string;
  brokerName?: string;
  transporterId?: string;
  transporterName?: string;
  transportCost: number;
  destination: string;
  totalBags: number;
  totalAmount: number;
  quantity: number;
  netWeight: number;
  rate: number;
  brokerageAmount?: number;
  transportAmount?: number;
  expenses?: number;
  notes?: string;
  items: SaleItem[];
  isDeleted?: boolean;
  bags: number;
  billNumber: string;
  billAmount: number | string;
  broker?: string;
  salesBroker?: string;
}

export interface InventoryItem {
  id: string;
  purchaseId: string;
  lotNumber: string;
  date: string;
  quantity: number;
  remainingQuantity: number;
  location: string;
  netWeight: number;
  rate: number;
  ratePerKgAfterExpenses: number;
  supplier: string;
  isDeleted: boolean;
  isSoldOut?: boolean;
  transferredFrom?: string;
  agentId?: string;
  agentName?: string;
  purchaseRate: number;
  finalCost: number;
  dateAdded: string;
  productType?: string;
}

export interface Payment {
  id: string;
  date: string;
  paymentNumber: string;
  supplierId?: string;
  supplierName?: string;
  brokerId?: string;
  brokerName?: string;
  amount: number;
  paymentMethod: 'cash' | 'bank';
  reference?: string;
  notes?: string;
  isDeleted?: boolean;
  partyId: string;
  partyName?: string;
  mode?: string;
}

export interface Receipt {
  id: string;
  date: string;
  receiptNumber: string;
  customerId?: string;
  customerName?: string;
  brokerId?: string;
  brokerName?: string;
  amount: number;
  paymentMethod: 'cash' | 'bank';
  reference?: string;
  notes?: string;
  isDeleted?: boolean;
  partyId: string;
  partyName?: string;
  entityId?: string;
  entityType?: string;
  mode?: string;
  paymentMode?: string;
}

// Entity interfaces
export interface BaseEntity {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  balance?: number;
  isDeleted?: boolean;
}

export interface Agent extends BaseEntity {
  commission?: number;
}

export interface Supplier extends BaseEntity {}

export interface Customer extends BaseEntity {}

export interface Broker extends BaseEntity {
  commissionRate?: number;
}

export interface Transporter extends BaseEntity {
  vehicleNumber?: string;
}

export interface Party extends BaseEntity {
  type: 'supplier' | 'customer' | 'broker' | 'transporter' | 'agent';
}

// Report interface
export interface EnhancedInventoryItem extends InventoryItem {
  agentName: string;
  soldQuantity: number;
  soldWeight: number;
  remainingWeight: number;
  totalValue: number;
  purchaseRate: number;
  finalCost: number;
}
