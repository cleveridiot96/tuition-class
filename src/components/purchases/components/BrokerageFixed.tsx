
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

interface BrokerageFixedProps {
  form: UseFormReturn<PurchaseFormData>;
  onChange?: (value: number) => void;
}

const BrokerageFixed: React.FC<BrokerageFixedProps> = ({ form, onChange }) => {
  // Watch for changes in the brokerageValue field
  const brokerageValue = form.watch("brokerageValue") || 0;
  
  React.useEffect(() => {
    if (onChange) {
      const fixedAmount = parseFloat(brokerageValue.toString()) || 0;
      onChange(fixedAmount);
    }
  }, [brokerageValue, onChange]);

  return (
    <FormField
      control={form.control}
      name="brokerageValue"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brokerage Amount (₹)</FormLabel>
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
