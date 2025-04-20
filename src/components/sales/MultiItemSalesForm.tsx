
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Customer, Broker, Transporter, Sale } from '@/services/types';
import ItemsTable from '../shared/ItemsTable';
import FormSummary from '../shared/FormSummary';
import { ItemFormState } from '../shared/types/ItemFormTypes';

interface MultiItemSalesFormProps {
  onCancel: () => void;
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
}

const MultiItemSalesForm: React.FC<MultiItemSalesFormProps> = ({
  onCancel,
  onSubmit,
  initialSale
}) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<ItemFormState & {
    customerId: string;
    brokerId: string;
  }>({
    lotNumber: initialSale?.lotNumber || '',
    date: initialSale?.date || new Date().toISOString().split('T')[0],
    location: initialSale?.location || '',
    customerId: initialSale?.customerId || '',
    brokerId: initialSale?.brokerId || '',
    transporterId: initialSale?.transporterId || '',
    transportCost: initialSale?.transportCost?.toString() || '0',
    items: initialSale?.items || [{ name: '', quantity: 0, rate: 0 }],
    notes: initialSale?.notes || '',
  });

  useEffect(() => {
    const mockGetLocations = () => ['Location A', 'Location B'];
    const mockGetCustomers = () => [
      { id: '1', name: 'Customer A', balance: 0 },
      { id: '2', name: 'Customer B', balance: 0 }
    ];
    const mockGetBrokers = () => [
      { id: '1', name: 'Broker A', commissionRate: 5, balance: 0 },
      { id: '2', name: 'Broker B', commissionRate: 10, balance: 0 }
    ];
    const mockGetTransporters = () => [
      { id: '1', name: 'Transporter A', balance: 0 },
      { id: '2', name: 'Transporter B', balance: 0 }
    ];

    setLocations(mockGetLocations());
    setCustomers(mockGetCustomers());
    setBrokers(mockGetBrokers());
    setTransporters(mockGetTransporters());

    if (initialSale) {
      setFormState({
        lotNumber: initialSale.lotNumber || '',
        date: initialSale.date || new Date().toISOString().split('T')[0],
        location: initialSale.location || '',
        customerId: initialSale.customerId || '',
        brokerId: initialSale.brokerId || '',
        transporterId: initialSale.transporterId || '',
        transportCost: initialSale.transportCost?.toString() || '0',
        items: initialSale.items || [{ name: '', quantity: 0, rate: 0 }],
        notes: initialSale.notes || '',
      });
      setSelectedBroker(brokers.find(broker => broker.id === initialSale.brokerId) || null);
    }
  }, [initialSale, brokers]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'brokerId') {
      const broker = brokers.find(broker => broker.id === value);
      setSelectedBroker(broker || null);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formState.items];
    updatedItems[index][field] = value;
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const handleAddItem = () => {
    setFormState(prevState => ({
      ...prevState,
      items: [...prevState.items, { name: '', quantity: 0, rate: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formState.items];
    updatedItems.splice(index, 1);
    setFormState(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const customer = customers.find(c => c.id === formState.customerId);
      if (!customer) throw new Error("Customer not found");

      const saleData: Sale = {
        id: initialSale?.id || uuidv4(),
        date: formState.date,
        lotNumber: formState.lotNumber,
        customerId: formState.customerId,
        customer: customer.name,
        brokerId: formState.brokerId || undefined,
        broker: brokers.find(b => b.id === formState.brokerId)?.name,
        transporterId: formState.transporterId || undefined,
        transporter: transporters.find(t => t.id === formState.transporterId)?.name,
        quantity: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        netWeight: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        rate: formState.items[0]?.rate || 0,
        location: formState.location,
        totalAmount: calculateTotal(),
        transportCost: parseFloat(formState.transportCost),
        items: formState.items,
        notes: formState.notes
      };

      onSubmit(saleData);
      toast({
        title: "Success",
        description: initialSale ? "Sale updated successfully" : "Sale added successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save sale",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const calculateBrokerageAmount = () => {
    if (!selectedBroker) return 0;
    return calculateSubtotal() * (selectedBroker.commissionRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + parseFloat(formState.transportCost || '0') + calculateBrokerageAmount();
  };

  return (
    <div className="w-full max-w-full px-2 sm:px-4 md:px-6 mx-auto overflow-x-hidden">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="lotNumber">Lot Number</Label>
            <Input
              id="lotNumber"
              name="lotNumber"
              value={formState.lotNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formState.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              name="location"
              value={formState.location}
              onValueChange={(value) => handleSelectChange('location', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerId">Customer</Label>
            <Select
              name="customerId"
              value={formState.customerId}
              onValueChange={(value) => handleSelectChange('customerId', value)}
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
              value={formState.brokerId}
              onValueChange={(value) => handleSelectChange('brokerId', value)}
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
              value={formState.transporterId}
              onValueChange={(value) => handleSelectChange('transporterId', value)}
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
              value={formState.transportCost}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <ItemsTable
            items={formState.items}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 rounded-md border"
              rows={3}
              value={formState.notes}
              onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <FormSummary
            subtotal={calculateSubtotal()}
            transportCost={parseFloat(formState.transportCost || '0')}
            brokerageAmount={calculateBrokerageAmount()}
            showBrokerage={!!selectedBroker}
            total={calculateTotal()}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Saving...' : initialSale ? 'Update Sale' : 'Save Sale'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultiItemSalesForm;
