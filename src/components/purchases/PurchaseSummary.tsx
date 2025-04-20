
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
    <div className="bg-green-50 p-6 rounded-md border-2 border-green-300">
      <h2 className="text-lg font-bold text-green-800 mb-4">Purchase Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-2 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="font-bold text-lg">₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Transport Cost</p>
          <p className="font-bold text-lg">₹{transportCost.toFixed(2)}</p>
        </div>
        {brokerageAmount > 0 && (
          <div className="p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-500">Brokerage</p>
            <p className="font-bold text-lg">₹{brokerageAmount.toFixed(2)}</p>
          </div>
        )}
        <div className="p-2 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Additional Expenses</p>
          <p className="font-bold text-lg">₹{expenses.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-white rounded shadow border-2 border-green-500">
          <p className="text-sm text-gray-500">Total After Expenses</p>
          <p className="font-bold text-lg text-green-700">₹{totalAfterExpenses.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-white rounded shadow border-2 border-green-500">
          <p className="text-sm text-gray-500">Rate/kg After Expenses</p>
          <p className="font-bold text-lg text-green-700">₹{ratePerKgAfterExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
