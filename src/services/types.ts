// Adding all the required interfaces

export interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  bags?: number;
  remainingQuantity?: number;
  location: string;
  dateAdded: string;
  purchaseId?: string;
  saleId?: string;
  netWeight?: number;
  rate?: number;
  isDeleted?: boolean;
  // Adding missing fields
  agentId?: string;
  agentName?: string;
  purchaseRate?: number;
  finalCost?: number;
  date?: string;
  transferredFrom?: string;  // Added for inventory transfers
}

// Adding EnhancedInventoryItem for StockReport
export interface EnhancedInventoryItem extends InventoryItem {
  agentName: string;
  soldQuantity: number;
  soldWeight: number;
  remainingWeight: number;
  totalValue: number;
  purchaseRate: number;
  finalCost: number;
  date: string;
}

// Adding Agent type
export interface Agent {
  id: string;
  name: string;
  balance?: number;
  commissionRate?: number;
  isDeleted?: boolean;
}

// Adding Supplier type
export interface Supplier {
  id: string;
  name: string;
  balance?: number;
  isDeleted?: boolean;
}

// Adding Customer type
export interface Customer {
  id: string;
  name: string;
  balance?: number;
  isDeleted?: boolean;
}

// Adding Broker type
export interface Broker {
  id: string;
  name: string;
  balance?: number;
  commissionRate?: number;
  isDeleted?: boolean;
}

// Adding Transporter type
export interface Transporter {
  id: string;
  name: string;
  vehicleNumber?: string;
  balance?: number;
  isDeleted?: boolean;
}

// Adding Purchase type
export interface Purchase {
  id: string;
  date: string;
  lotNumber: string;
  location: string;
  quantity: number;
  netWeight?: number;
  rate: number;
  totalAmount: number;
  agentId?: string;
  agent?: string;
  broker?: string;
  party?: string;
  transporterId?: string;
  transporter?: string;
  transportCost?: number;
  transportAmount?: number;
  transportRate?: number;
  brokerageType?: string;
  brokerageRate?: number;
  brokerageValue?: number;
  brokerageAmount?: number;
  expenses?: number;
  totalAfterExpenses?: number;
  notes?: string;
  isDeleted?: boolean;
  bags?: number;
  items?: any[];
  billNumber?: string;
  billAmount?: number;
}

// Adding Sale type
export interface Sale {
  id: string;
  date: string;
  lotNumber: string;
  location: string;
  quantity: number;
  netWeight?: number;
  rate: number;
  totalAmount: number;
  customerId: string;
  customer: string;
  brokerId?: string;
  broker?: string;
  salesBroker?: string;
  transporterId?: string;
  transporter?: string;
  transportCost?: number;
  notes?: string;
  isDeleted?: boolean;
  bags?: number;
  items?: any[];
  billNumber?: string;
  billAmount?: number;
  amount?: number;
  brokerageAmount?: number; // Added this property
}

// Adding Payment type
export interface Payment {
  id: string;
  date: string;
  paymentNumber: string;
  entityId: string;
  entityType: "supplier" | "broker";
  amount: number;
  paymentMethod: "cash" | "bank";
  reference?: string;
  notes?: string;
  isDeleted?: boolean;
  // Adding missing fields used in the app
  partyId?: string;
  partyName?: string;
  mode?: "cash" | "bank";
  partyType?: string;
  paymentMode?: "cash" | "bank";
}

// Adding Receipt type
export interface Receipt {
  id: string;
  date: string;
  receiptNumber: string;
  entityId: string;
  entityType: "broker" | "customer";
  amount: number;
  paymentMethod: "cash" | "bank";
  reference?: string;
  notes?: string;
  isDeleted?: boolean;
  // Adding missing fields used in the app
  customerId?: string;
  customerName?: string;
  brokerId?: string; 
  brokerName?: string;
  mode?: "cash" | "bank";
  partyId?: string;
  partyName?: string;
  partyType?: string;
  paymentMode?: "cash" | "bank";
}
