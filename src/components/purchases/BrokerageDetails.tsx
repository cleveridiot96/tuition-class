
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BrokeragePercentage from "./components/BrokeragePercentage";
import BrokerageFixed from "./components/BrokerageFixed";
import BrokerageDisplay from "./components/BrokerageDisplay";
import { BrokerageDetailsProps } from "./types/BrokerageTypes";

const BrokerageDetails: React.FC<BrokerageDetailsProps> = ({
  form,
  brokerageAmount,
  totalAmount,
}) => {
  const brokerageType = form.watch("brokerageType");
  const brokerageValue = form.watch("brokerageValue");

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
                value={field.value}
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
      
      {brokerageType === "percentage" ? (
        <BrokeragePercentage form={form} totalAmount={totalAmount} />
      ) : (
        <BrokerageFixed form={form} />
      )}
      
      <BrokerageDisplay 
        brokerageAmount={brokerageAmount}
        totalAmount={totalAmount}
        brokerageType={brokerageType}
        brokerageValue={brokerageValue}
      />
    </div>
  );
};

export default BrokerageDetails;
