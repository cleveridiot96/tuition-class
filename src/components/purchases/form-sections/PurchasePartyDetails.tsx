
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-select";

interface PurchasePartyDetailsProps {
  form: any;
  partyManagement: any;
}

const PurchasePartyDetails: React.FC<PurchasePartyDetailsProps> = ({
  form,
  partyManagement,
}) => {
  const { suppliers = [], agents = [] } = partyManagement || {};

  // Convert to options for searchable selects
  const supplierOptions = suppliers.map(supplier => ({ 
    value: supplier.name, 
    label: supplier.name 
  }));
  
  const agentOptions = [
    { value: "", label: "None" },
    ...agents.map(agent => ({ 
      value: agent.id, 
      label: agent.name 
    }))
  ];

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Party Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="party"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party Name</FormLabel>
              <FormControl>
                <EnhancedSearchableSelect
                  options={supplierOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select or enter party name"
                  className="w-full"
                  masterType="supplier"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <EnhancedSearchableSelect
                  options={agentOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select agent"
                  className="w-full"
                  masterType="agent"
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

export default PurchasePartyDetails;
