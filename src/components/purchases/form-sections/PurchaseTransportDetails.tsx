
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

const PurchaseTransportDetails: React.FC<PurchaseTransportDetailsProps> = ({
  form,
}) => {
  const transporters = getTransporters() || [];
  
  // Convert to options format for searchable select
  const transporterOptions = [
    { value: "", label: "None" },
    ...transporters.map(t => ({ value: t.id, label: t.name }))
  ];

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Transport Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="transporterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Transporter</FormLabel>
              <FormControl>
                <EnhancedSearchableSelect
                  options={transporterOptions}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Select transporter"
                  className="w-full"
                  masterType="transporter"
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
              <FormLabel optional>Transport Rate (per kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field}
                  value={field.value || ''}
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
