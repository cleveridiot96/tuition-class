
export interface Master {
  id: string;
  name: string;
  isDeleted?: boolean;
  type?: string;
  commissionRate?: number;
}

export interface AddToMasterProps {
  masterType?: "supplier" | "customer" | "broker" | "transporter" | "item" | "party";
}

export interface DialogState {
  isOpen: boolean;
  itemName: string;
  onConfirm?: (value: string) => void;
  masterType?: string;
}
