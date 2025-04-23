
import { z } from "zod";

export const purchaseFormSchema = z.object({
  date: z.string().nonempty("Date is required"),
  lotNumber: z.string().nonempty("Lot number is required"),
  bags: z.coerce.number().min(1, "Bags must be at least 1"),
  party: z.string().optional(),
  agentId: z.string().optional(),
  location: z.string().nonempty("Location is required"),
  netWeight: z.coerce.number().min(0.01, "Net weight must be greater than 0"),
  rate: z.coerce.number().min(0.01, "Rate must be greater than 0"),
  transporterId: z.string().optional(),
  transportRate: z.coerce.number().min(0, "Transport rate cannot be negative").default(0),
  expenses: z.coerce.number().min(0, "Expenses cannot be negative").default(0),
  brokerageType: z.enum(["percentage", "fixed"]).default("percentage"),
  brokerageValue: z.coerce.number().min(0, "Brokerage value cannot be negative").default(1), // Default 1%
  notes: z.string().optional(),
  // Making these truly optional
  billNumber: z.string().optional().or(z.literal("")),
  billAmount: z.coerce.number().optional(),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
