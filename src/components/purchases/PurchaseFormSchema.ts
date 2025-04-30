
import * as z from "zod";

// Schema for purchase form data with field validation
export const purchaseFormSchema = z.object({
  date: z.string({
    required_error: "Date is required",
  }),
  lotNumber: z.string().optional(),
  bags: z.union([z.number().int().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? (parseInt(val) || 0) : val
  ),
  party: z.string().optional(),
  location: z.string().optional(),
  netWeight: z.union([z.number().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? (parseFloat(val) || 0) : val
  ),
  rate: z.union([z.number().positive(), z.string()]).transform(val => 
    typeof val === 'string' ? (parseFloat(val) || 0) : val
  ),
  transporterId: z.string().optional(),
  transportRate: z.union([z.number().min(0), z.string()]).transform(val => 
    typeof val === 'string' ? (parseFloat(val) || 0) : val
  ).optional().default(0),
  expenses: z.union([z.number().min(0), z.string()]).transform(val => 
    typeof val === 'string' ? (parseFloat(val) || 0) : val
  ).optional().default(0),
  brokerageType: z.enum(["percentage", "fixed"]).default("percentage"),
  brokerageValue: z.union([z.number().min(0), z.string()]).transform(val => 
    typeof val === 'string' ? (parseFloat(val) || 0) : val
  ).optional().default(1),
  notes: z.string().optional(),
  agentId: z.string().optional(),
  billNumber: z.string().optional(),
  billAmount: z.union([z.number().min(0), z.null()]).optional(),
}).refine(data => data.party || data.agentId, {
  message: "Either Supplier Name or Agent must be specified",
  path: ["party"],
});

// Type definition for purchase form data
export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
