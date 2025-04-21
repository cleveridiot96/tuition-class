
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
}) => (
  <div className="space-y-1 bg-gray-50 p-3 rounded-md">
    <p className="text-sm">
      <span className="font-medium">Subtotal:</span> ₹
      {subtotal.toLocaleString()}
    </p>
    <p className="text-sm">
      <span className="font-medium">Transport:</span> ₹
      {transportCost.toLocaleString()}
    </p>
    <p className="text-sm">
      <span className="font-medium">Brokerage:</span> ₹
      {brokerageAmount.toLocaleString()}
    </p>
    <p className="text-sm font-semibold">
      <span>Total:</span> ₹
      {(subtotal + transportCost + brokerageAmount).toLocaleString()}
    </p>
    {isCutBill && billAmount !== null && (
      <p className="text-sm font-bold text-yellow-700">
        <span>Bill Amount:</span> ₹
        {billAmount.toLocaleString()}
      </p>
    )}
  </div>
);

export default SalesFormSummary;
