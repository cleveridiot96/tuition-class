
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-select";
import { getTransporters } from "@/services/storageService";

interface PurchaseTransportDetailsProps {
  form: any;
}

const PurchaseTransportDetails: React.FC<PurchaseTransportDetailsProps> = ({ form }) => {
  const transporters = getTransporters() || [];
  
  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Transport Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="transporterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transporter</FormLabel>
              <FormControl>
                <EnhancedSearchableSelect
                  options={transporters.map(transporter => ({ 
                    value: transporter.id, 
                    label: transporter.name 
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select transporter"
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="transportRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Rate (₹/kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="expenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other Expenses (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="Optional"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseTransportDetails;
