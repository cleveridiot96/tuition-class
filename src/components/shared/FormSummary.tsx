
import React from 'react';

export interface FormSummaryProps {
  subtotal: number;
  transportCost: number;
  brokerageAmount?: number;
  showBrokerage?: boolean;
  expenses?: number;
  total: number;
  isSalesForm?: boolean; // Added to differentiate between sales and purchase forms
}

const FormSummary: React.FC<FormSummaryProps> = ({
  subtotal,
  transportCost,
  brokerageAmount = 0,
  showBrokerage = false,
  expenses = 0,
  total,
  isSalesForm = false
}) => {
  // Format number with appropriate precision
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <div className="space-y-2 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium text-gray-800">Summary</h3>
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span className="font-medium">₹{formatCurrency(subtotal)}</span>
      </div>
      
      {transportCost > 0 && (
        <div className="flex justify-between">
          <span>Transport:</span>
          <span>₹{formatCurrency(transportCost)}</span>
        </div>
      )}
      
      {showBrokerage && brokerageAmount > 0 && (
        <div className="flex justify-between">
          <span>Brokerage:</span>
          <span className={isSalesForm ? "text-red-600" : ""}>
            {isSalesForm ? "-" : ""}₹{formatCurrency(brokerageAmount)}
          </span>
        </div>
      )}
      
      {expenses > 0 && (
        <div className="flex justify-between">
          <span>Expenses:</span>
          <span>₹{formatCurrency(expenses)}</span>
        </div>
      )}
      
      <div className="flex justify-between border-t pt-2">
        <span className="font-bold">Total:</span>
        <span className="font-bold">₹{formatCurrency(
          // For sales forms, don't include brokerage in the total
          isSalesForm && showBrokerage ? total - (brokerageAmount || 0) : total
        )}</span>
      </div>
    </div>
  );
};

export default FormSummary;
