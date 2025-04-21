
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

export interface BrokerageDetailsProps {
  form: UseFormReturn<PurchaseFormData>;
  brokerageAmount: number;
  totalAmount: number;
}

export interface BrokerageDisplayProps {
  brokerageAmount: number;
  totalAmount: number;
  brokerageType: string;
  brokerageValue: number;
}
