
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddToMaster } from "@/hooks/useAddToMaster";

interface PurchasePartyDetailsProps {
  form: any;
  formSubmitted?: boolean;
  partyManagement: {
    suppliers: any[];
    agents: any[];
    transporters: any[];
    loadData: () => void;
    loading: boolean;
  };
}

const PurchasePartyDetails: React.FC<PurchasePartyDetailsProps> = ({
  form,
  formSubmitted = false,
  partyManagement
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();

  const handleAddSupplier = () => {
    confirmAddToMaster('', (value) => {
      if (value) {
        form.setValue("party", value);
        if (partyManagement && typeof partyManagement.loadData === "function") {
          partyManagement.loadData();
        }
      }
    }, "supplier");
  };

  const handleAddAgent = () => {
    confirmAddToMaster('', (value) => {
      // After agent is added, we need to refresh the data and find the new agent's ID
      if (value) {
        if (partyManagement && typeof partyManagement.loadData === "function") {
          partyManagement.loadData();
        }
        // The actual agent selection will happen when the data is refreshed
      }
    }, "agent");
  };

  const handleSupplierAddNew = (name: string): string => {
    confirmAddToMaster(name, (value) => {
      if (value) {
        form.setValue("party", value);
        if (partyManagement && typeof partyManagement.loadData === "function") {
          partyManagement.loadData();
        }
      }
    }, "supplier");
    return "";
  };

  const handleAgentAddNew = (name: string): string => {
    confirmAddToMaster(name, (value) => {
      if (partyManagement && typeof partyManagement.loadData === "function") {
        partyManagement.loadData();
      }
    }, "agent");
    return "";
  };

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Supplier Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="party"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Supplier Name <span className="text-red-500">*</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAddSupplier}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.suppliers || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : fieldState.invalid === false ? "border-green-500" : ""}
                  placeholder="Select or add supplier"
                  masterType="supplier"
                  onAddNew={handleSupplierAddNew}
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
                  onClick={handleAddAgent}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.agents || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : fieldState.invalid === false ? "border-green-500" : ""}
                  placeholder="Select or add agent"
                  masterType="agent"
                  onAddNew={handleAgentAddNew}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
      <AddToMasterDialog />
    </div>
  );
};

export default PurchasePartyDetails;
