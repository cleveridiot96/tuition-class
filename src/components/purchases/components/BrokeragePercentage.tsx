
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrokeragePercentageProps } from "../types/BrokerageTypes";

const BrokeragePercentage: React.FC<BrokeragePercentageProps> = ({ form, totalAmount }) => {
  return (
    <FormField
      control={form.control}
      name="brokerageValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brokerage Percentage (%)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              step="0.01"
              placeholder="1.00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrokeragePercentage;
