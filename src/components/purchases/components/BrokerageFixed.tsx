
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrokerageFixedProps } from "../types/BrokerageTypes";

const BrokerageFixed: React.FC<BrokerageFixedProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="brokerageValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fixed Amount (₹)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              step="0.01"
              placeholder="0.00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrokerageFixed;
