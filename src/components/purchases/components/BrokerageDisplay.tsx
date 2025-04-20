
import React from "react";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BrokerageDisplayProps } from "../types/BrokerageTypes";

const BrokerageDisplay: React.FC<BrokerageDisplayProps> = ({ 
  brokerageAmount, 
  totalAmount, 
  brokerageType, 
  brokerageValue 
}) => {
  return (
    <FormItem>
      <FormLabel>Calculated Brokerage (₹)</FormLabel>
      <Input 
        type="number" 
        value={brokerageAmount.toFixed(2)} 
        readOnly
        className="bg-gray-100"
      />
      {brokerageType === "percentage" && (
        <p className="text-xs text-gray-500 mt-1">
          {brokerageValue || 0}% of ₹{totalAmount.toFixed(2)} = ₹{brokerageAmount.toFixed(2)}
        </p>
      )}
    </FormItem>
  );
};

export default BrokerageDisplay;
