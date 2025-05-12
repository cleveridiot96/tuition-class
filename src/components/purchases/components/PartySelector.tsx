
import React, { useState, useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { getSuppliers } from "@/services/storageService";
import { toast } from "sonner";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { useGlobalMasterDialog } from "@/hooks/useGlobalMasterDialog";

interface PartySelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const PartySelector: React.FC<PartySelectorProps> = ({ form, partyManagement }) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const { GlobalMasterAddDialog, open } = useGlobalMasterDialog();
  
  const loadSuppliers = useCallback(() => {
    const supplierData = getSuppliers() || [];
    const activeSuppliers = supplierData.filter(s => !s.isDeleted);
    setSuppliers(activeSuppliers);
    
    const options = activeSuppliers.map(supplier => ({
      value: supplier.name,
      label: supplier.name
    }));
    
    setSupplierOptions(options);
  }, []);
  
  useEffect(() => {
    loadSuppliers();
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(loadSuppliers, 1000);
    return () => clearInterval(intervalId);
  }, [loadSuppliers]);
  
  return (
    <>
      <FormField
        control={form.control}
        name="party"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Party Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <EnhancedSearchableSelect
                options={supplierOptions}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Select or enter party name"
                masterType="supplier"
                emptyMessage="No suppliers found"
                label="Party Name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <GlobalMasterAddDialog />
    </>
  );
};

export default PartySelector;
