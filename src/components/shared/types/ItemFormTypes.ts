
export interface Item {
  id?: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface ItemFormState {
  date: string;
  lotNumber: string;
  location: string;
  transporterId: string;
  transportCost: string;
  items: Item[];
  notes: string;
}

export interface ItemTableProps {
  items: Item[];
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

export interface FormSummaryProps {
  subtotal: number;
  transportCost: number;
  brokerageAmount?: number;
  showBrokerage?: boolean;
  expenses?: number;
  total: number;
}
