
import React from "react";

interface PurchaseSummaryProps {
  totalAmount: number;
  transportCost: number;
  brokerageAmount: number;
  showBrokerage: boolean;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  totalAmount,
  transportCost,
  brokerageAmount,
  showBrokerage,
  expenses,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Transport Cost</p>
          <p className="font-bold">₹{transportCost.toFixed(2)}</p>
        </div>
        {showBrokerage && (
          <div>
            <p className="text-sm text-gray-500">Brokerage</p>
            <p className="font-bold">₹{brokerageAmount.toFixed(2)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Additional Expenses</p>
          <p className="font-bold">₹{expenses || 0}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total After Expenses</p>
          <p className="font-bold">₹{totalAfterExpenses.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rate/kg After Expenses</p>
          <p className="font-bold">₹{ratePerKgAfterExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
