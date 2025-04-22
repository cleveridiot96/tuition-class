
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
  purchaseRate?: number;
  finalCost?: number;
  date?: string;
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
  address?: string;
  phone?: string;
  email?: string;
  balance?: number;
  commissionRate?: number;
  isDeleted?: boolean;
}

// Adding Supplier type
export interface Supplier {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance?: number;
  isDeleted?: boolean;
}

// Adding Customer type
export interface Customer {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance?: number;
  isDeleted?: boolean;
}

// Adding Broker type
export interface Broker {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  balance?: number;
  commissionRate?: number;
  isDeleted?: boolean;
}

// Adding Transporter type
export interface Transporter {
  id: string;
  name: string;
  address?: string;
  phone?: string;
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
  party?: string;
  transporterId?: string;
  transporter?: string;
  transportCost?: number;
  transportAmount?: number;
  brokerageType?: string;
  brokerageRate?: number;
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
}
