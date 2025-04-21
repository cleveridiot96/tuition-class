
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../../purchases/PurchaseFormSchema";

export interface BrokerageFixedProps {
  form: UseFormReturn<PurchaseFormData>;
  onChange?: (value: number) => void;
}

export interface BrokeragePercentageProps {
  form: UseFormReturn<PurchaseFormData>;
  totalAmount: number;
  onChange?: (value: number) => void;
}

export interface BrokerageDisplayProps {
  brokerageAmount: number;
  totalAmount: number;
  brokerageType: string;
  brokerageValue: number;
}
