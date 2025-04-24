
import { z } from "zod";

export const purchaseFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  bags: z.number().min(1, "Bags must be at least 1"),
  netWeight: z.number().min(1, "Net weight is required"),
  rate: z.number().min(1, "Rate is required"),
  transporterId: z.string().optional(),
  transportRate: z.number().optional(),
  // Make expenses field optional
  expenses: z.number().optional().default(0),
  brokerageType: z.enum(["percentage", "fixed"]).optional(),
  brokerageValue: z.number().optional(),
  // Make both party and agentId optional, but one must be provided (validated in the handler)
  party: z.string().optional(),
  agentId: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
  billNumber: z.string().optional(),
  billAmount: z.number().optional(),
});

// Export types for use in other components
export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
