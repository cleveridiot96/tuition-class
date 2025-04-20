
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BrokerageSectionProps {
  brokerageType: string;
  brokerageRate: number;
  brokerageAmount: number;
  onBrokerageTypeChange: (type: string) => void;
  onBrokerageRateChange: (value: number) => void;
}

const BrokerageSection: React.FC<BrokerageSectionProps> = ({
  brokerageType,
  brokerageRate,
  brokerageAmount,
  onBrokerageTypeChange,
  onBrokerageRateChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-md bg-gray-50">
      <div>
        <Label>Brokerage Type</Label>
        <RadioGroup 
          value={brokerageType} 
          onValueChange={onBrokerageTypeChange}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <label htmlFor="percentage">Percentage (%)</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <label htmlFor="fixed">Fixed Amount (₹)</label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="brokerageRate">
          {brokerageType === 'percentage' ? 'Brokerage Rate (%)' : 'Fixed Amount (₹)'}
        </Label>
        <Input
          id="brokerageRate"
          type="number"
          value={brokerageRate}
          onChange={(e) => onBrokerageRateChange(parseFloat(e.target.value))}
          className="mt-2"
          step="0.01"
        />
      </div>

      <div>
        <Label>Calculated Brokerage</Label>
        <Input
          type="text"
          value={`₹ ${brokerageAmount.toFixed(2)}`}
          readOnly
          className="bg-gray-100 mt-2"
        />
      </div>
    </div>
  );
};

export default BrokerageSection;
