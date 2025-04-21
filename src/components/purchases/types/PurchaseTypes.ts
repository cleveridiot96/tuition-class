
import { UseFormReturn } from "react-hook-form";

export interface PurchaseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export interface PurchaseFormHeaderProps {
  form: UseFormReturn<PurchaseFormData>;
}

export interface PurchaseDetailsProps {
  form: UseFormReturn<PurchaseFormData>;
  locations: string[];
}

// Use 'export type' when re-exporting with isolatedModules enabled
export type { PurchaseFormData } from "../PurchaseFormSchema";
