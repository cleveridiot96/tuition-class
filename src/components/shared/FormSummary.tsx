
import React from 'react';
import { FormSummaryProps } from './types/ItemFormTypes';

const FormSummary: React.FC<FormSummaryProps> = ({
  subtotal,
  transportCost,
  brokerageAmount = 0,
  showBrokerage = false,
  expenses = 0,
  total
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Transport:</span>
        <span>₹{transportCost.toFixed(2)}</span>
      </div>
      {showBrokerage && (
        <div className="flex justify-between">
          <span>Brokerage:</span>
          <span>₹{brokerageAmount.toFixed(2)}</span>
        </div>
      )}
      {expenses > 0 && (
        <div className="flex justify-between">
          <span>Expenses:</span>
          <span>₹{expenses.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2">
        <span className="font-bold">Total:</span>
        <span className="font-bold">₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default FormSummary;
