
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

interface BrokeragePercentageProps {
  form: UseFormReturn<PurchaseFormData>;
  totalAmount: number;
  onChange?: (value: number) => void;
}

const BrokeragePercentage: React.FC<BrokeragePercentageProps> = ({ form, totalAmount, onChange }) => {
  // Watch for changes in the brokerageValue field
  const brokerageValue = form.watch("brokerageValue") || 1;
  
  // Set default value to 1% when component mounts if no value is set
  React.useEffect(() => {
    if (!form.getValues("brokerageValue")) {
      form.setValue("brokerageValue", 1);
    }
  }, [form]);
  
  // When brokerageValue or totalAmount changes, calculate and call onChange
  React.useEffect(() => {
    if (onChange) {
      const percentage = parseFloat(brokerageValue.toString()) || 1;
      const calculatedAmount = (totalAmount * percentage) / 100;
      onChange(calculatedAmount);
    }
  }, [brokerageValue, totalAmount, onChange]);

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
              defaultValue="1.00"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BrokeragePercentage;
