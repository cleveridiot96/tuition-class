
// Define common form state for both purchase and sales forms
export interface ItemFormState {
  date: string;
  lotNumber: string;
  location: string;
  transporterId: string;
  transportCost: string;
  notes: string;
  items: Array<{
    id?: string;
    name: string;
    quantity: number;
    rate: number;
  }>;
  expenses?: string | number;
  bags?: number;
  brokerageType?: string;
  brokerageRate?: number;
  brokerageAmount?: number;
  agentId?: string;
  billNumber?: string;
  billAmount?: string | number | null;
  brokerId?: string;
  customerId?: string;
}
