
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Broker } from '@/services/types';
import { v4 as uuidv4 } from 'uuid';

interface BrokerFormProps {
  onSubmit: (broker: Broker) => void;
  initialData?: Broker;
}

const BrokerForm: React.FC<BrokerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Broker>(
    initialData || {
      id: uuidv4(),
      name: '',
      phone: '',
      address: '',
      rate: 0,
      balance: 0,
      isDeleted: false,
      commissionRate: 1
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'rate' || name === 'commissionRate') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Broker Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
        <Input
          id="commissionRate"
          name="commissionRate"
          type="number"
          step="0.01"
          value={formData.commissionRate || 1}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="mt-4 w-full">
        {initialData ? 'Update Broker' : 'Add Broker'}
      </Button>
    </form>
  );
};

export default BrokerForm;
