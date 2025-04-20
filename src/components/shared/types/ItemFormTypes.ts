
export interface FormSummaryProps {
  subtotal: number;
  transportCost: number;
  brokerageAmount?: number;
  showBrokerage?: boolean;
  expenses?: number;
  total: number;
}

export interface ItemFormState {
  lotNumber: string;
  date: string;
  location: string;
  transporterId: string;
  transportCost: string;
  notes: string;
  items: { id?: string, name: string; quantity: number; rate: number; }[];
  expenses?: number;
}

export interface BrokeragePercentageProps {
  form: any;
  totalAmount: number;
  onChange?: (value: number) => void;
}

export interface BrokerageFixedProps {
  form: any;
  onChange?: (value: number) => void;
}

export interface LocationOption {
  value: string;
  label: string;
}

// Additional types for purchase form
export interface PurchaseItemState extends ItemFormState {
  bags: number;
  netWeight: number;
  rate: number;
  agentId: string;
  brokerageType: 'percentage' | 'fixed';
  brokerageValue: number;
  billAmount?: string; // Added for bill amount
  billNumber?: string; // Added for bill number
}
