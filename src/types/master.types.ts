
export type MasterType = "supplier" | "customer" | "broker" | "agent" | "transporter" | "party";

export interface Master {
  id: string;
  name: string;
  isDeleted?: boolean;
  type: MasterType;
  commissionRate?: number;
  // Removed phone and address as requested
}

export interface AddToMasterProps {
  masterType?: MasterType;
}

export interface DialogState {
  isOpen: boolean;
  itemName: string;
  onConfirm?: (value: string) => void;
  masterType?: string;
}

export interface MasterFormValues {
  name: string;
  commissionRate?: number;
  type: MasterType;
}
