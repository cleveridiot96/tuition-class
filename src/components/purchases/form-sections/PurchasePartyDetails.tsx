
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PurchasePartyDetailsProps {
  form: any;
  formSubmitted?: boolean;
  partyManagement: {
    suppliers: any[];
    agents: any[];
    handleAddParty: (type: string) => void;
    handleAddAgent: () => void;
  };
}

const PurchasePartyDetails: React.FC<PurchasePartyDetailsProps> = ({
  form,
  formSubmitted = false,
  partyManagement
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Party Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="party"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Party Name <span className="text-red-500">*</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => partyManagement.handleAddParty('supplier')}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.suppliers}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                  placeholder="Select or add party"
                  masterType="supplier"
                  onAddNew={(name) => {
                    partyManagement.handleAddParty('supplier');
                    return name;
                  }}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Agent
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={partyManagement.handleAddAgent}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.agents}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                  placeholder="Select or add agent"
                  masterType="agent"
                  onAddNew={(name) => {
                    partyManagement.handleAddAgent();
                    return name;
                  }}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchasePartyDetails;
