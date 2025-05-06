
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WeightDetailsProps {
  form: any;
}

const WeightDetails: React.FC<WeightDetailsProps> = ({ form }) => {
  const netWeight = form.watch("netWeight") || 0;
  const bags = form.watch("bags") || 0;
  const avgBagWeight = bags > 0 ? (netWeight / bags).toFixed(2) : "0";

  return (
    <>
      <FormField
        control={form.control}
        name="bags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bags</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value, 10) || 0);
                  // Could calculate estimated weight if needed
                }}
              />
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
              <Input 
                type="number" 
                step="0.01" 
                {...field}
                onChange={(e) => {
                  field.onChange(parseFloat(e.target.value) || 0);
                  // Trigger calculations when weight changes
                  form.trigger();
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground">
              Avg. Bag Weight: {avgBagWeight} kg
            </p>
          </FormItem>
        )}
      />
    </>
  );
};

export default WeightDetails;
