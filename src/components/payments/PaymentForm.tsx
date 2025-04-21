
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { getSuppliers, getCustomers, getTransporters, getAgents } from '@/services/storageService';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [paymentData, setPaymentData] = useState({
    id: initialData?.id || Date.now().toString(),
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    partyType: initialData?.partyType || 'supplier',
    partyId: initialData?.partyId || '',
    amount: initialData?.amount || '',
    paymentMode: initialData?.paymentMode || 'cash',
    referenceNumber: initialData?.referenceNumber || '',
    notes: initialData?.notes || '',
  });

  const [parties, setParties] = useState<any[]>([]);

  // Load parties based on selected party type
  useEffect(() => {
    loadParties();
  }, [paymentData.partyType]);

  const loadParties = () => {
    switch(paymentData.partyType) {
      case 'supplier':
        setParties(getSuppliers());
        break;
      case 'customer':
        setParties(getCustomers());
        break;
      case 'transporter':
        setParties(getTransporters());
        break;
      case 'agent':
        setParties(getAgents());
        break;
      default:
        setParties([]);
    }
  };

  const handleChange = (name: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.partyId || !paymentData.amount) {
      alert('Please select a party and enter amount');
      return;
    }
    
    onSubmit({
      ...paymentData,
      amount: parseFloat(paymentData.amount.toString()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={paymentData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="partyType">Party Type</Label>
          <Select
            value={paymentData.partyType}
            onValueChange={(value) => {
              handleChange('partyType', value);
              handleChange('partyId', '');
            }}
          >
            <SelectTrigger id="partyType">
              <SelectValue placeholder="Select party type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="transporter">Transporter</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="partyId">Party Name</Label>
        <Select
          value={paymentData.partyId}
          onValueChange={(value) => handleChange('partyId', value)}
          required
        >
          <SelectTrigger id="partyId">
            <SelectValue placeholder="Select party" />
          </SelectTrigger>
          <SelectContent>
            {parties.map((party) => (
              <SelectItem key={party.id} value={party.id}>
                {party.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={paymentData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="paymentMode">Payment Mode</Label>
          <Select
            value={paymentData.paymentMode}
            onValueChange={(value) => handleChange('paymentMode', value)}
            required
          >
            <SelectTrigger id="paymentMode">
              <SelectValue placeholder="Select payment mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="online">Online Transfer</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paymentData.paymentMode !== 'cash' && (
        <div>
          <Label htmlFor="referenceNumber">Reference Number</Label>
          <Input
            id="referenceNumber"
            value={paymentData.referenceNumber}
            onChange={(e) => handleChange('referenceNumber', e.target.value)}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={paymentData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Enter any additional notes"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Save'} Payment
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
