
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BillDetailsProps {
  form: any;
}

const BillDetails: React.FC<BillDetailsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="billNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel optional>Bill Number</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter bill number (if available)" />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="billAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel optional>Bill Amount (₹)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field} 
                placeholder="Enter bill amount (if available)" 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default BillDetails;
