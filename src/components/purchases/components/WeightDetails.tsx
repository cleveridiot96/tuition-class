
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WeightDetailsProps {
  form: any;
}

const WeightDetails: React.FC<WeightDetailsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="bags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bags</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="netWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Net Weight (kg)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default WeightDetails;
