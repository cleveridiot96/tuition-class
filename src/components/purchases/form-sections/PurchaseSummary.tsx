
import React from "react";
import { safeNumber } from "@/lib/utils";

interface PurchaseSummaryProps {
  totalAmount: number;
  transportCost: number;
  expenses: number | string | null | undefined;
  brokerageAmount: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  totalAmount,
  transportCost,
  expenses,
  brokerageAmount,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
}) => {
  // Format number with appropriate precision
  const formatNumber = (value: number | string | null | undefined): string => {
    const numValue = safeNumber(value, 0);
    return numValue.toFixed(2);
  };
  
  return (
    <div className="bg-blue-100/80 p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-medium mb-3 text-blue-800">Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700">Total Amount:</span>
          <span className="font-medium">₹{formatNumber(totalAmount)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700">Transport Cost:</span>
          <span className="font-medium">₹{formatNumber(transportCost)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700">Brokerage Amount:</span>
          <span className="font-medium">₹{formatNumber(brokerageAmount)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700">Additional Expenses:</span>
          <span className="font-medium">₹{formatNumber(expenses)}</span>
        </div>
        
        <div className="flex justify-between pt-2 border-t border-blue-200">
          <span className="font-medium text-blue-800">Total After Expenses:</span>
          <span className="font-bold text-blue-800">₹{formatNumber(totalAfterExpenses)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700">Rate per kg (after expenses):</span>
          <span className="font-medium">₹{formatNumber(ratePerKgAfterExpenses)}</span>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
