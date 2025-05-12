
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { useGlobalMasterDialog } from "@/hooks/useGlobalMasterDialog";

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
  const { GlobalMasterAddDialog } = useGlobalMasterDialog();

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Supplier Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="party"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Supplier Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.suppliers || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : fieldState.invalid === false ? "border-green-500" : ""}
                  placeholder="Select or add supplier"
                  masterType="supplier"
                  label="Supplier Name"
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
              <FormLabel>
                Agent
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.agents || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : fieldState.invalid === false ? "border-green-500" : ""}
                  placeholder="Select or add agent"
                  masterType="agent"
                  label="Agent"
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
      <GlobalMasterAddDialog />
    </div>
  );
};

export default PurchasePartyDetails;
