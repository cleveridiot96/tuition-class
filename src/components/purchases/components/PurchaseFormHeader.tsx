
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PurchaseFormHeaderProps } from "../types/PurchaseTypes";

const PurchaseFormHeader: React.FC<PurchaseFormHeaderProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lotNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lot Number (Vakkal)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter lot number (e.g. DD/12)" />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Format: Name/BagCount (e.g. DD/12 for 12 bags)
            </p>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PurchaseFormHeader;
