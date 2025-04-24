
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
  transporterId?: string;
  transportRate?: number;
  expenses?: number;
  brokerageType?: string;
  brokerageValue?: number;
  notes?: string;
  agentId?: string;
  billNumber?: string;
  billAmount?: number;
  isDeleted?: boolean;
  totalAmount?: number;
  transportCost?: number;
  brokerageAmount?: number;
  totalAfterExpenses?: number;
  ratePerKgAfterExpenses?: number;
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
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  customerName?: string;
  brokerId?: string;
  brokerName?: string;
  transporterId?: string;
  transporterName?: string;
  destination: string;
  totalBags: number;
  totalAmount: number;
  brokerageAmount?: number;
  transportAmount?: number;
  expenses?: number;
  notes?: string;
  items: SaleItem[];
  isDeleted?: boolean;
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
}
