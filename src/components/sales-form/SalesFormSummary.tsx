
import React from "react";

interface SalesFormSummaryProps {
  subtotal: number;
  transportCost: number;
  brokerageAmount: number;
  isCutBill: boolean;
  billAmount: number|null;
}

const SalesFormSummary: React.FC<SalesFormSummaryProps> = ({
  subtotal,
  transportCost,
  brokerageAmount,
  isCutBill,
  billAmount,
}) => {
  // Ensure all values are valid numbers for formatting
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return value.toLocaleString();
  };

  // Calculate total amount without including brokerage (per requirements)
  const totalAmount = (subtotal || 0) + (transportCost || 0);

  return (
    <div className="space-y-1 bg-gray-50 p-3 rounded-md shadow-sm">
      <p className="text-sm">
        <span className="font-medium">Subtotal:</span> ₹{formatNumber(subtotal)}
      </p>
      {transportCost > 0 && (
        <p className="text-sm">
          <span className="font-medium">Transport:</span> ₹{formatNumber(transportCost)}
        </p>
      )}
      <p className="text-sm text-red-600">
        <span className="font-medium">Brokerage:</span> -₹{formatNumber(brokerageAmount)}
      </p>
      <p className="text-sm font-semibold">
        <span>Total:</span> ₹{formatNumber(totalAmount)}
      </p>
      {isCutBill && billAmount !== null && (
        <p className="text-sm font-bold text-yellow-700">
          <span>Bill Amount:</span> ₹{formatNumber(billAmount)}
        </p>
      )}
    </div>
  );
};

export default SalesFormSummary;
