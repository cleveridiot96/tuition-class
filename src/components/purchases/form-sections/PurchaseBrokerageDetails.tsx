
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PurchaseBrokerageDetails = ({ form, showBrokerage, brokerageAmount }) => {
  if (!showBrokerage) return null;

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Brokerage Details</h3>
      <div className="space-y-4">
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
                  className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage">Percentage (%)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Amount (₹)</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brokerageValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch("brokerageType") === "percentage"
                    ? "Brokerage Percentage"
                    : "Brokerage Amount (₹)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Calculated Amount (₹)</FormLabel>
            <Input
              type="number"
              value={brokerageAmount.toFixed(2)}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseBrokerageDetails;
