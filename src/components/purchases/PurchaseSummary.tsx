
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
  return (
    <div className="p-4 border rounded-md bg-blue-50 space-y-3">
      <h3 className="text-lg font-semibold text-blue-800">Purchase Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div>
          <p className="text-sm text-gray-600">Total Amount:</p>
          <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Transport Cost:</p>
          <p className="font-medium">₹{transportCost.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Brokerage:</p>
          <p className="font-medium">₹{brokerageAmount.toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Other Expenses:</p>
          <p className="font-medium">₹{expenses.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="border-t border-blue-200 pt-3 mt-3">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Final Amount:</p>
            <p className="text-xl font-bold text-blue-900">₹{totalAfterExpenses.toFixed(2)}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium text-blue-700">Rate/KG After Expenses:</p>
            <p className="text-xl font-bold text-blue-900">₹{ratePerKgAfterExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
