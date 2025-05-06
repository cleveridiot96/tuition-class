
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RateDetailsProps {
  form: any;
}

const RateDetails: React.FC<RateDetailsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate (₹/kg)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  // Trigger total calculations when rate changes
                  form.trigger();
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="expenses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Expenses (₹)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  // Trigger total calculations when expenses change
                  form.trigger();
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default RateDetails;
