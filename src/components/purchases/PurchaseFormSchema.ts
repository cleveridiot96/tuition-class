
import { z } from 'zod';

export const purchaseFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  lotNumber: z.string().min(1, { message: "Lot Number is required" }),
  bags: z.number().min(1, { message: "Number of bags must be greater than 0" }),
  party: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  netWeight: z.number().min(1, { message: "Net weight must be greater than 0" }),
  rate: z.number().min(0.01, { message: "Rate must be greater than 0" }),
  transporterId: z.string().optional(),
  transportRate: z.number().min(0, { message: "Transport rate cannot be negative" }),
  expenses: z.number().min(0, { message: "Expenses cannot be negative" }).optional().default(0),
  brokerageType: z.enum(["percentage", "fixed"]).default("percentage"),
  brokerageValue: z.number().min(0, { message: "Brokerage value cannot be negative" }),
  notes: z.string().optional(),
  agentId: z.string().optional(),
  billNumber: z.string().optional(),
  billAmount: z.number().nullable().optional(),
}).refine((data) => data.party || data.agentId, {
  message: "Either Party Name or Agent must be specified",
  path: ["party"]
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
