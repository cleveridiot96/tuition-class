
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RateDetailsProps {
  form: any;
}

const RateDetails: React.FC<RateDetailsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="rate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rate per kg (₹)</FormLabel>
          <FormControl>
            <Input type="number" {...field} placeholder="0.00" step="0.01" />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default RateDetails;
