
export interface ItemFormState {
  lotNumber: string;
  date: string;
  location: string;
  transporterId: string;
  transportCost: string;
  items: {
    id?: string;
    name: string;
    quantity: number;
    rate: number;
  }[];
  notes: string;
  expenses?: number;
  brokerageType?: string;
  brokerageRate?: number;
  bags?: number;
}
