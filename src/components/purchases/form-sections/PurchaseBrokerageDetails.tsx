
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PurchaseBrokerageDetailsProps {
  form: any;
  showBrokerage: boolean;
  brokerageAmount: number;
}

const PurchaseBrokerageDetails: React.FC<PurchaseBrokerageDetailsProps> = ({
  form,
  showBrokerage,
  brokerageAmount,
}) => {
  // Apply dimmed styling when brokerage is not applicable
  const dimmedStyle = !showBrokerage ? "opacity-50 pointer-events-none" : "";
  
  return (
    <div className={`border rounded-md p-4 bg-blue-50/40 ${dimmedStyle}`}>
      <h3 className="text-lg font-medium mb-4 text-blue-800">
        Brokerage Details
        {!showBrokerage && <span className="text-sm text-gray-500 ml-2">(Select an agent to enable)</span>}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="brokerageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brokerage Type</FormLabel>
              <Select
                disabled={!showBrokerage}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brokerage type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
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
                  ? "Brokerage Rate (%)"
                  : "Brokerage Amount (₹)"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  disabled={!showBrokerage}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expenses"
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Other Expenses (₹)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showBrokerage && (
          <div className="col-span-3 mt-2">
            <p className="text-sm text-right">
              Total Brokerage Amount: ₹{brokerageAmount.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseBrokerageDetails;
