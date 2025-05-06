
import React from "react";

interface SalesFormSummaryProps {
  subtotal: number;
  transportCost: number | string | null;
  brokerageAmount: number | null;
  isCutBill: boolean;
  billAmount: number | string | null;
}

// Safe number formatter to prevent the toFixed error
const safeFormat = (value: any): string => {
  if (value === undefined || value === null) return "0.00";
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
  }
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return "0.00";
};

const SalesFormSummary: React.FC<SalesFormSummaryProps> = ({
  subtotal,
  transportCost,
  brokerageAmount,
  isCutBill,
  billAmount
}) => {
  // Safely convert all values to numbers
  const safeSubtotal = typeof subtotal === 'number' ? subtotal : 0;
  const safeTransportCost = typeof transportCost === 'number' 
    ? transportCost 
    : parseFloat(transportCost as string || '0') || 0;
  const safeBrokerageAmount = brokerageAmount || 0;
  
  // Calculate total
  const calculatedTotal = safeSubtotal + safeTransportCost + safeBrokerageAmount;
  
  // If cut bill is enabled, use the bill amount as the total
  const finalTotal = isCutBill && billAmount !== null && billAmount !== undefined
    ? (typeof billAmount === 'number' ? billAmount : parseFloat(billAmount as string) || 0)
    : calculatedTotal;

  return (
    <div className="w-full md:w-72 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-2 text-gray-800">Sale Summary</h3>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>₹{safeFormat(safeSubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Transport Cost:</span>
          <span>₹{safeFormat(safeTransportCost)}</span>
        </div>
        {safeBrokerageAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span>Brokerage:</span>
            <span>₹{safeFormat(safeBrokerageAmount)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 my-1 pt-1"></div>
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span className={isCutBill ? "text-yellow-600" : ""}>
            ₹{safeFormat(finalTotal)}
          </span>
        </div>
        {isCutBill && billAmount !== null && (
          <div className="text-xs text-yellow-600 italic">
            (Custom bill amount)
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesFormSummary;
