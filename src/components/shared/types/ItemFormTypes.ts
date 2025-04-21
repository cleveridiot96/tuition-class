
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
  expenses?: string;
  bags?: number;
}
