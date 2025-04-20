
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "./PurchaseTypes";

export interface BrokerageDetailsProps {
  form: UseFormReturn<PurchaseFormData>;
  brokerageAmount: number;
  totalAmount: number;
}

export interface BrokeragePercentageProps {
  form: UseFormReturn<PurchaseFormData>;
  totalAmount: number;
}

export interface BrokerageFixedProps {
  form: UseFormReturn<PurchaseFormData>;
}

export interface BrokerageDisplayProps {
  brokerageAmount: number;
  totalAmount: number;
  brokerageType: string;
  brokerageValue: number;
}
