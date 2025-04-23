
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

interface PartySelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const PartySelector: React.FC<PartySelectorProps> = ({ form, partyManagement }) => {
  const suppliers = partyManagement?.suppliers || [];
  
  return (
    <FormField
      control={form.control}
      name="party"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between">
            <FormLabel>Party Name</FormLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => partyManagement.setShowAddSupplierDialog(true)}
              className="h-6 px-2 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
          <FormControl>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select party" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier: any) => (
                  <SelectItem key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PartySelector;
