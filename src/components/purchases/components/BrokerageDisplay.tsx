
import React from 'react';

interface BrokerageDisplayProps {
  brokerageAmount: number;
  totalAmount: number;
  brokerageType: string;
  brokerageValue: number;
}

/**
 * Display component for brokerage information in the purchase form
 */
const BrokerageDisplay = ({
  brokerageAmount,
  totalAmount,
  brokerageType,
  brokerageValue
}: BrokerageDisplayProps) => {
  // Safe formatting function
  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return "0";
    return value.toLocaleString();
  };
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Brokerage Summary</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-600">Base Amount:</div>
        <div className="font-medium">₹{formatNumber(totalAmount)}</div>
        
        <div className="text-gray-600">Brokerage Type:</div>
        <div className="font-medium">
          {brokerageType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </div>
        
        <div className="text-gray-600">Brokerage Rate:</div>
        <div className="font-medium">
          {brokerageType === 'percentage' ? `${formatNumber(brokerageValue)}%` : `₹${formatNumber(brokerageValue)}`}
        </div>
        
        <div className="text-gray-600">Brokerage Amount:</div>
        <div className="font-medium">₹{formatNumber(brokerageAmount)}</div>
      </div>
    </div>
  );
};

export default BrokerageDisplay;
