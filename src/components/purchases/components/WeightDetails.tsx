
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const WeightDetails = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bags</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="netWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Net Weight (KG)</FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0.01"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="party"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Party</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default WeightDetails;
