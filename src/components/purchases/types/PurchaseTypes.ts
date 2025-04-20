
import { z } from "zod";
import { purchaseFormSchema } from "../PurchaseFormSchema";
import { UseFormReturn } from "react-hook-form";

export type PurchaseFormData = z.infer<typeof purchaseFormSchema> & {
  bags?: number;
};

export interface PurchaseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export interface PurchaseFormHeaderProps {
  form: any;
}

export interface PurchasePartyDetailsProps {
  form: any;
  suppliers: any[];
  brokers: any[];
  onAddSupplier: (name: string) => void;
  onAddBroker: (name: string) => void;
}

export interface PurchaseDetailsProps {
  form: UseFormReturn<PurchaseFormData>;
  locations: string[];
}

export interface PurchaseTransportProps {
  form: any;
  transporters: any[];
  onAddTransporter: (name: string) => void;
}

export interface PurchaseExpensesProps {
  form: any;
  showBrokerage: boolean;
  brokerageAmount: number;
  totalAmount: number;
}

export interface PurchaseSummaryProps {
  totalAmount: number;
  transportCost: number;
  brokerageAmount: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
}
