import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getLocations,
  getCustomers,
  getBrokers,
  getTransporters,
  addCustomer,
  addBroker,
  addTransporter,
  getSales,
  addSale,
  updateSale,
  saveSales
} from "@/services/storageService";
import { Customer, Broker, Transporter, Sale } from "@/services/types";
import { v4 as uuidv4 } from 'uuid';

interface MultiItemSalesFormProps {
  onCancel: () => void;
  onSubmit: (sale: Sale) => void;
  initialSale?: Sale;
}

interface Item {
  name: string;
  quantity: number;
  rate: number;
}

const MultiItemSalesForm = (props: MultiItemSalesFormProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<string[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [formState, setFormState] = useState({
    lotNumber: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    customerId: '',
    brokerId: '',
    transporterId: '',
    transportCost: '0',
    items: [{ name: '', quantity: 0, rate: 0 }],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isAddBrokerDialogOpen, setIsAddBrokerDialogOpen] = useState(false);
  const [newBrokerName, setNewBrokerName] = useState('');
  const [newBrokerCommissionRate, setNewBrokerCommissionRate] = useState('0');
  const [isAddTransporterDialogOpen, setIsAddTransporterDialogOpen] = useState(false);
  const [newTransporterName, setNewTransporterName] = useState('');
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  useEffect(() => {
    // Load initial data
    setLocations(getLocations() || []);
    setCustomers(getCustomers() || []);
    setBrokers(getBrokers() || []);
    setTransporters(getTransporters() || []);

    // If initial sale data is provided, populate the form
    if (props.initialSale) {
      const initialSale = props.initialSale;
      setFormState({
        lotNumber: initialSale.lotNumber || '',
        date: initialSale.date || new Date().toISOString().split('T')[0],
        location: initialSale.location || '',
        customerId: initialSale.customerId || '',
        brokerId: initialSale.brokerId || '',
        transporterId: initialSale.transporterId || '',
        transportCost: initialSale.transportCost?.toString() || '0',
        items: initialSale.items || [{ name: '', quantity: 0, rate: 0 }],
        notes: initialSale.notes || ''
      });
      setSelectedBroker(brokers.find(broker => broker.id === initialSale.brokerId) || null);
    }
  }, [props.initialSale, brokers]);

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

  const calculateSubtotal = (): number => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const calculateBrokerCommission = (): number => {
    if (!selectedBroker) return 0;
    return calculateSubtotal() * (selectedBroker.commissionRate / 100);
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    const brokerCommission = calculateBrokerCommission();
    return subtotal + transportCost + brokerCommission;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const saleData = {
        id: props.initialSale?.id || uuidv4(),
        lotNumber: formState.lotNumber,
        date: formState.date,
        location: formState.location,
        customerId: formState.customerId,
        brokerId: formState.brokerId,
        transporterId: formState.transporterId,
        transportCost: parseFloat(formState.transportCost || '0'),
        items: formState.items,
        notes: formState.notes,
        totalAmount: calculateTotal(),
        broker: selectedBroker,
      };

      if (props.initialSale) {
        updateSale(saleData);
        toast({
          title: "Sale Updated",
          description: "The sale has been updated successfully.",
        });
      } else {
        addSale(saleData);
        toast({
          title: "Sale Added",
          description: "The sale has been added successfully.",
        });
      }

      props.onSubmit(saleData);
    } catch (error) {
      console.error("Error submitting sale:", error);
      toast({
        title: "Error",
        description: "Failed to save the sale. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustomerClick = () => {
    setIsAddCustomerDialogOpen(true);
  };

  const handleAddCustomer = async () => {
    if (newCustomerName.trim() === '') {
      toast({
        title: "Error",
        description: "Customer name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCustomer = {
        id: uuidv4(),
        name: newCustomerName,
        contact: '',
        address: '',
        notes: ''
      };
      addCustomer(newCustomer);
      setCustomers(getCustomers() || []); // Refresh customers
      setFormState(prevState => ({
        ...prevState,
        customerId: newCustomer.id // Automatically select the new customer
      }));
      toast({
        title: "Customer Added",
        description: "New customer has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error",
        description: "Failed to add the customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddCustomerDialogOpen(false);
      setNewCustomerName('');
    }
  };

  const handleAddBrokerClick = () => {
    setIsAddBrokerDialogOpen(true);
  };

  const handleAddBroker = async () => {
    if (newBrokerName.trim() === '') {
      toast({
        title: "Error",
        description: "Broker name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const commissionRate = parseFloat(newBrokerCommissionRate);
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
      toast({
        title: "Error",
        description: "Commission rate must be a number between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newBroker = {
        id: uuidv4(),
        name: newBrokerName,
        contact: '',
        address: '',
        notes: '',
        commissionRate: commissionRate
      };
      addBroker(newBroker);
      setBrokers(getBrokers() || []); // Refresh brokers
      setFormState(prevState => ({
        ...prevState,
        brokerId: newBroker.id // Automatically select the new broker
      }));
      setSelectedBroker(newBroker);
      toast({
        title: "Broker Added",
        description: "New broker has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding broker:", error);
      toast({
        title: "Error",
        description: "Failed to add the broker. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddBrokerDialogOpen(false);
      setNewBrokerName('');
      setNewBrokerCommissionRate('0');
    }
  };

  const handleAddTransporterClick = () => {
    setIsAddTransporterDialogOpen(true);
  };

  const handleAddTransporter = async () => {
    if (newTransporterName.trim() === '') {
      toast({
        title: "Error",
        description: "Transporter name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTransporter = {
        id: uuidv4(),
        name: newTransporterName,
        contact: '',
        address: '',
        notes: ''
      };
      addTransporter(newTransporter);
      setTransporters(getTransporters() || []); // Refresh transporters
      setFormState(prevState => ({
        ...prevState,
        transporterId: newTransporter.id // Automatically select the new transporter
      }));
      toast({
        title: "Transporter Added",
        description: "New transporter has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding transporter:", error);
      toast({
        title: "Error",
        description: "Failed to add the transporter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddTransporterDialogOpen(false);
      setNewTransporterName('');
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="customerId">Customer</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddCustomerClick}
              >
                Add New
              </Button>
            </div>
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
            <div className="flex justify-between items-center">
              <Label htmlFor="brokerId">Broker</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddBrokerClick}
              >
                Add New
              </Button>
            </div>
            <Select
              name="brokerId"
              value={formState.brokerId}
              onValueChange={(value) => handleSelectChange('brokerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select broker (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {brokers.map(broker => (
                  <SelectItem key={broker.id} value={broker.id}>
                    {broker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="transporterId">Transporter</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddTransporterClick}
              >
                Add New
              </Button>
            </div>
            <Select
              name="transporterId"
              value={formState.transporterId}
              onValueChange={(value) => handleSelectChange('transporterId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transporter (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
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

        <div className="border rounded-md p-4 bg-white overflow-x-auto">
          <div className="w-full min-w-[650px]">
            <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {formState.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-4">
                  <Input
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    name="rate"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                    placeholder="Rate"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    name="amount"
                    type="number"
                    value={(item.quantity * item.rate).toFixed(2)}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {formState.items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="mt-2"
            >
              Add Item
            </Button>
          </div>
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
              onChange={(e) => handleInputChange({
                target: { name: 'notes', value: e.target.value }
              } as React.ChangeEvent<HTMLInputElement>)}
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport:</span>
              <span>₹{Number(formState.transportCost || 0).toFixed(2)}</span>
            </div>
            {formState.brokerId && selectedBroker && (
              <div className="flex justify-between">
                <span>Broker ({selectedBroker.commissionRate}%):</span>
                <span>₹{calculateBrokerCommission().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Total:</span>
              <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Sale'}
          </Button>
        </div>
      </form>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddCustomer}>
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Broker Dialog */}
      <Dialog open={isAddBrokerDialogOpen} onOpenChange={setIsAddBrokerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Broker</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={newBrokerName}
                onChange={(e) => setNewBrokerName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commissionRate" className="text-right">
                Commission Rate (%)
              </Label>
              <Input
                type="number"
                id="commissionRate"
                value={newBrokerCommissionRate}
                onChange={(e) => setNewBrokerCommissionRate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBrokerDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddBroker}>
              Add Broker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transporter Dialog */}
      <Dialog open={isAddTransporterDialogOpen} onOpenChange={setIsAddTransporterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={newTransporterName}
                onChange={(e) => setNewTransporterName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTransporterDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddTransporter}>
              Add Transporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiItemSalesForm;
