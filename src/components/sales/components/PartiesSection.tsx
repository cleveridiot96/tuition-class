
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer, Broker, Transporter } from '@/services/types';

interface PartiesSectionProps {
  customers: Customer[];
  brokers: Broker[];
  transporters: Transporter[];
  customerId: string;
  brokerId: string;
  transporterId: string;
  transportCost: string;
  onSelectChange: (name: string, value: string) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PartiesSection: React.FC<PartiesSectionProps> = ({
  customers,
  brokers,
  transporters,
  customerId,
  brokerId,
  transporterId,
  transportCost,
  onSelectChange,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <Label htmlFor="customerId">Customer</Label>
        <Select
          name="customerId"
          value={customerId}
          onValueChange={(value) => onSelectChange('customerId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="brokerId">Broker</Label>
        <Select
          name="brokerId"
          value={brokerId}
          onValueChange={(value) => onSelectChange('brokerId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select broker (optional)" />
          </SelectTrigger>
          <SelectContent>
            {brokers.map(broker => (
              <SelectItem key={broker.id} value={broker.id}>
                {broker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="transporterId">Transporter</Label>
        <Select
          name="transporterId"
          value={transporterId}
          onValueChange={(value) => onSelectChange('transporterId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transporter (optional)" />
          </SelectTrigger>
          <SelectContent>
            {transporters.map(transporter => (
              <SelectItem key={transporter.id} value={transporter.id}>
                {transporter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="transportCost">Transport Cost</Label>
        <Input
          id="transportCost"
          name="transportCost"
          type="number"
          value={transportCost}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default PartiesSection;
