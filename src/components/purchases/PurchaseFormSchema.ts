
import * as z from "zod";

export const purchaseFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  brokerId: z.string().optional(),
  party: z.string().min(1, "Party is required"),
  location: z.string().min(1, "Location is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().min(1, "Transporter is required"),
  transportRate: z.coerce.number().min(0, "Transport rate must be valid"),
  expenses: z.coerce.number().min(0, "Expenses must be valid"),
  brokerageType: z.enum(["percentage", "fixed"]).optional(),
  brokerageValue: z.coerce.number().min(0, "Brokerage value must be valid").optional(),
  notes: z.string().optional(),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
