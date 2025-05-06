
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { purchaseFormSchema } from "../PurchaseFormSchema";

// Define the form data type
export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;

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
