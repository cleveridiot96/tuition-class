
import { z } from 'zod';

// Schema for validation
export const purchaseFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  lotNumber: z.string().min(1, { message: "Lot Number is required" }),
  bags: z.number().optional().default(0),
  party: z.string().optional().default(""),
  location: z.string().optional().default(""),
  netWeight: z.number().optional().default(0),
  rate: z.number().optional().default(0),
  transporterId: z.string().optional().default(""),
  transportRate: z.number().optional().default(0),
  expenses: z.number().optional().default(0), // Make expenses optional
  brokerageType: z.enum(["percentage", "fixed"]).default("percentage"),
  brokerageValue: z.number().optional().default(0),
  notes: z.string().optional().default(""),
  agentId: z.string().optional().default(""),
  billNumber: z.string().optional().default(""),
  billAmount: z.number().optional().nullable(),
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
