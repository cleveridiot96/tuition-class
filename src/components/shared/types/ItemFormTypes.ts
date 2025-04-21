
export interface ItemFormState {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

export interface ItemFormProps {
  items: ItemFormState[];
  onItemChange: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}
