
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface BrokerageDetailsProps {
  form: any;
  brokerageAmount: number;
  totalAmount: number;
}

const BrokerageDetails: React.FC<BrokerageDetailsProps> = ({
  form,
  brokerageAmount,
  totalAmount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50 mb-4">
      <FormField
        control={form.control}
        name="brokerageType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Brokerage Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <label htmlFor="percentage">Percentage (%)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <label htmlFor="fixed">Fixed Amount (₹)</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="brokerageValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {form.watch("brokerageType") === "percentage" 
                ? "Brokerage Percentage (%)" 
                : "Fixed Amount (₹)"}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                step="0.01"
                placeholder={form.watch("brokerageType") === "percentage" ? "1.00" : "0.00"}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="md:col-span-1">
        <label className="text-sm font-medium">Calculated Brokerage (₹)</label>
        <Input 
          type="number" 
          value={brokerageAmount.toFixed(2)} 
          readOnly
          className="bg-gray-100"
        />
        {form.watch("brokerageType") === "percentage" && (
          <p className="text-xs text-gray-500 mt-1">
            {form.watch("brokerageValue") || 0}% of ₹{totalAmount.toFixed(2)} = ₹{brokerageAmount.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrokerageDetails;
