
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddToMaster } from "@/hooks/useAddToMaster";

interface PurchaseTransportDetailsProps {
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

const PurchaseTransportDetails: React.FC<PurchaseTransportDetailsProps> = ({
  form,
  formSubmitted = false,
  partyManagement
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();

  const handleAddTransporter = () => {
    confirmAddToMaster('', (value) => {
      // After transporter is added, refresh the data
      if (value) {
        if (partyManagement && typeof partyManagement.loadData === "function") {
          partyManagement.loadData();
        }
        form.setValue("transporterId", value);
      }
    }, "transporter");
  };

  const handleTransporterAddNew = (name: string): string => {
    confirmAddToMaster(name, (value) => {
      if (value) {
        form.setValue("transporterId", value);
        if (partyManagement && typeof partyManagement.loadData === "function") {
          partyManagement.loadData();
        }
      }
    }, "transporter");
    return "";
  };

  return (
    <div className="border rounded-md p-4 bg-gray-50/70">
      <h3 className="text-lg font-medium mb-4 text-gray-700">Transport Details <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="transporterId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Transporter
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={handleAddTransporter}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </FormLabel>
              <FormControl>
                <EnhancedSearchableSelect 
                  options={partyManagement.transporters || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                  placeholder="Select or add transporter"
                  masterType="transporter"
                  onAddNew={handleTransporterAddNew}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportRate"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Transport Rate</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value || ""}
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

export default PurchaseTransportDetails;
