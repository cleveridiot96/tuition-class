
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
}
