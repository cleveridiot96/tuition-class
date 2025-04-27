
import { z } from 'zod';

export const purchaseFormSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  lotNumber: z.string().min(1, { message: "Lot Number is required" }),
  bags: z.number()
    .min(1, { message: "Number of bags must be greater than 0" })
    .max(999, { message: "Number of bags seems too high" }),
  party: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  netWeight: z.number()
    .min(1, { message: "Net weight must be greater than 0" })
    .max(99999, { message: "Net weight seems too high" }),
  rate: z.number()
    .min(0.01, { message: "Rate must be greater than 0" })
    .max(999, { message: "Rate seems too high" }),
  transporterId: z.string().optional(),
  transportRate: z.number().min(0, { message: "Transport rate cannot be negative" }).optional(),
  expenses: z.number().min(0, { message: "Expenses cannot be negative" }).optional().default(0),
  brokerageType: z.enum(["percentage", "fixed"]).default("percentage"),
  brokerageValue: z.number().min(0, { message: "Brokerage value cannot be negative" }),
  notes: z.string().optional(),
  agentId: z.string().optional(),
  billNumber: z.string().optional(),
  billAmount: z.number().nullable().optional(),
}).refine((data) => {
  // Ensure average bag weight is reasonable (between 45-55 kg)
  if (data.bags && data.netWeight) {
    const avgWeight = data.netWeight / data.bags;
    return avgWeight >= 45 && avgWeight <= 55;
  }
  return true;
}, {
  message: "Average bag weight should be between 45-55 kg",
  path: ["netWeight"]
}).refine((data) => data.party || data.agentId, {
  message: "Either Party Name or Agent must be specified",
  path: ["party"]
});

export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
