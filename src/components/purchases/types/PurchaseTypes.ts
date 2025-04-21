
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

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
