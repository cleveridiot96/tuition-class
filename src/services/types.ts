
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
  quantity?: number; // Add quantity property
  transporterId?: string;
  transportRate?: number;
  expenses?: number;
  brokerageType?: string;
  brokerageRate?: number; // Add brokerageRate property
  brokerageValue?: number;
  notes?: string;
  agentId?: string;
  agent?: string; // Add agent property for compatibility
  broker?: string; // Add broker property for compatibility
  transporter?: string; // Add transporter property for compatibility
  billNumber?: string;
  billAmount?: number;
  isDeleted?: boolean;
  totalAmount?: number;
  transportCost?: number;
  transportAmount?: number;
  brokerageAmount?: number;
  totalAfterExpenses?: number;
  ratePerKgAfterExpenses?: number;
  items?: Array<{id?: string; name: string; quantity: number; rate: number;}>;
}

export interface Purchase extends BasePurchase {
  // Additional purchase-specific fields
}

export interface SaleItem {
  id: string;
  inventoryItemId: string;
  lotNumber: string;
  quantity: number;
  rate: number;
  totalAmount: number;
  name?: string; // Add name property for compatibility
}

export interface Sale {
  id: string;
  date: string;
  lotNumber?: string; // Make lotNumber optional but available
  location?: string; // Add location property
  customerId: string;
  customerName?: string;
  brokerId?: string;
  brokerName?: string;
  transporterId?: string;
  transporterName?: string;
  transportCost?: number; // Add transportCost property
  destination: string;
  totalBags: number;
  totalAmount: number;
  quantity?: number; // Add quantity property
  netWeight?: number; // Add netWeight property
  rate?: number; // Add rate property
  brokerageAmount?: number;
  transportAmount?: number;
  expenses?: number;
  notes?: string;
  items: SaleItem[];
  isDeleted?: boolean;
  bags?: number; // Add bags property
  billNumber?: string; // Add billNumber property
  billAmount?: number | string; // Add billAmount property
  broker?: string; // Add broker property for compatibility
  salesBroker?: string; // Add salesBroker property
}

export interface InventoryItem {
  id: string;
  purchaseId: string;
  lotNumber: string;
  date: string;
  quantity: number;
  remainingQuantity?: number;
  location: string;
  netWeight: number;
  rate: number;
  ratePerKgAfterExpenses: number;
  supplier: string;
  isDeleted: boolean;
  isSoldOut?: boolean;
  transferredFrom?: string;
  agentId?: string; // Add agentId property
  purchaseRate?: number; // Add purchaseRate property
  finalCost?: number; // Add finalCost property
  dateAdded?: string; // Add dateAdded property
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
  partyId?: string; // Add partyId property
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
  partyId?: string; // Add partyId property
}

// Add missing interfaces
export interface Agent {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface Broker {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  commissionRate?: number;
}

export interface Transporter {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// Add EnhancedInventoryItem for StockReport
export interface EnhancedInventoryItem extends InventoryItem {
  agentName: string;
  soldQuantity: number;
  soldWeight: number;
  remainingWeight: number;
  totalValue: number;
  purchaseRate: number;
  finalCost: number;
}
