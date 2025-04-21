
import React from "react";

interface PurchaseSummaryProps {
  totalAmount: number;
  transportCost: number;
  brokerageAmount: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  totalAmount,
  transportCost,
  brokerageAmount,
  expenses,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
}) => {
  // Safe formatting function to handle potential null/undefined values
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "0.00";
    return value.toFixed(2);
  };

  return (
    <div className="p-4 border rounded-md bg-blue-50 space-y-3">
      <h3 className="text-lg font-semibold text-blue-800">Purchase Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div>
          <p className="text-sm text-gray-600">Total Amount:</p>
          <p className="font-medium">₹{formatNumber(totalAmount)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Transport Cost:</p>
          <p className="font-medium">₹{formatNumber(transportCost)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Brokerage:</p>
          <p className="font-medium">₹{formatNumber(brokerageAmount)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Other Expenses:</p>
          <p className="font-medium">₹{formatNumber(expenses)}</p>
        </div>
      </div>
      
      <div className="border-t border-blue-200 pt-3 mt-3">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-blue-700">Final Amount:</p>
            <p className="text-xl font-bold text-blue-900">₹{formatNumber(totalAfterExpenses)}</p>
          </div>
          
          <div className="sm:text-right">
            <p className="text-sm font-medium text-blue-700">Rate/KG After Expenses:</p>
            <p className="text-xl font-bold text-blue-900">₹{formatNumber(ratePerKgAfterExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
