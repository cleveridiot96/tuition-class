
import React from 'react';
import { BrokerageDetailsProps } from '../types/BrokerageTypes';

/**
 * Display component for brokerage information in the purchase form
 */
const BrokerageDisplay = ({
  brokerageAmount,
  totalAmount,
  brokerageType,
  brokerageValue
}: {
  brokerageAmount: number;
  totalAmount: number;
  brokerageType: string;
  brokerageValue: number;
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium mb-2">Brokerage Summary</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-600">Base Amount:</div>
        <div className="font-medium">₹{totalAmount?.toLocaleString()}</div>
        
        <div className="text-gray-600">Brokerage Type:</div>
        <div className="font-medium">
          {brokerageType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </div>
        
        <div className="text-gray-600">Brokerage Rate:</div>
        <div className="font-medium">
          {brokerageType === 'percentage' ? `${brokerageValue}%` : `₹${brokerageValue}`}
        </div>
        
        <div className="text-gray-600">Brokerage Amount:</div>
        <div className="font-medium">₹{brokerageAmount?.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default BrokerageDisplay;
