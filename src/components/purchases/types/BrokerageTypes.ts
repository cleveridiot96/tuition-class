
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "./PurchaseTypes";

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

export interface BrokerageFormProps {
  form: UseFormReturn<PurchaseFormData>;
  brokerageType: string;
  onBrokerageTypeChange: (type: string) => void;
}
