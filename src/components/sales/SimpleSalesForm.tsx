
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers, getBrokers, getTransporters, getInventory, addCustomer, addBroker, addTransporter } from "@/services/storageService";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimpleSalesFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  onPrint?: () => void;
}

const SimpleSalesForm: React.FC<SimpleSalesFormProps> = ({ onSubmit, onCancel, initialData, onPrint }) => {
  // Form data state
  const [formData, setFormData] = useState({
    id: initialData?.id || `sale-${Date.now()}`,
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    lotNumber: initialData?.lotNumber || '',
    customerId: initialData?.customerId || '',
    brokerId: initialData?.brokerId || '',
    transporterId: initialData?.transporterId || '',
    quantity: initialData?.quantity || 0,
    netWeight: initialData?.netWeight || 0,
    rate: initialData?.rate || 0,
    location: initialData?.location || '',
    transportCost: initialData?.transportCost || 0,
    brokerageAmount: initialData?.brokerageAmount || 0,
    billNumber: initialData?.billNumber || '',
    billAmount: initialData?.billAmount || '',
    notes: initialData?.notes || '',
    totalAmount: initialData?.totalAmount || 0,
    bags: initialData?.bags || 0
  });

  // Entity lists
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']);
  
  // New entity dialog states
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  
  // New entity form states
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerCommission, setNewBrokerCommission] = useState<string>("1");
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterVehicle, setNewTransporterVehicle] = useState<string>("");
  
  // Selected entities
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    setCustomers(getCustomers() || []);
    setBrokers(getBrokers() || []);
    setTransporters(getTransporters() || []);
    
    const inventoryItems = getInventory() || [];
    const availableItems = inventoryItems.filter(
      (item) => !item.isDeleted && item.remainingQuantity > 0
    );
    setInventory(availableItems);
    
    if (initialData?.lotNumber) {
      const lot = inventoryItems.find((item) => item.lotNumber === initialData.lotNumber);
      if (lot) {
        setSelectedLot(lot);
        setMaxQuantity(lot.remainingQuantity + (initialData.quantity || 0));
      }
    }
    
    if (initialData?.brokerId) {
      const broker = getBrokers()?.find((b) => b.id === initialData.brokerId);
      if (broker) {
        setSelectedBroker(broker);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle quantity/rate changes to update calculated fields
    if (name === 'quantity' || name === 'rate') {
      updateCalculatedValues({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Special handling for lot selection
    if (name === 'lotNumber') {
      handleLotChange(value);
    }
    
    // Special handling for broker selection
    if (name === 'brokerId') {
      handleBrokerChange(value);
    }
  };
  
  const handleLotChange = (lotNumber: string) => {
    const lot = inventory.find((item) => item.lotNumber === lotNumber);
    if (lot) {
      setSelectedLot(lot);
      setMaxQuantity(lot.remainingQuantity);
      
      // Set default quantity to 1 (limited by available quantity)
      const newQuantity = Math.min(1, lot.remainingQuantity);
      const newFormData = {
        ...formData,
        lotNumber,
        quantity: newQuantity,
        rate: lot.rate || 0
      };
      
      setFormData(newFormData);
      updateCalculatedValues(newFormData);
    }
  };
  
  const handleBrokerChange = (brokerId: string) => {
    const broker = brokers.find((b) => b.id === brokerId);
    setSelectedBroker(broker || null);
    
    // Update brokerage amount based on new broker
    updateCalculatedValues({
      ...formData,
      brokerId
    });
  };
  
  const updateCalculatedValues = (data: any) => {
    const quantity = parseFloat(data.quantity) || 0;
    const rate = parseFloat(data.rate) || 0;
    const transportCost = parseFloat(data.transportCost) || 0;
    
    // Calculate net weight based on selected lot
    let netWeight = quantity;
    if (selectedLot && selectedLot.netWeight && selectedLot.quantity) {
      const weightPerUnit = selectedLot.netWeight / selectedLot.quantity;
      netWeight = quantity * weightPerUnit;
    }
    
    // Calculate brokerage amount
    let brokerageAmount = 0;
    if (selectedBroker && selectedBroker.commissionRate) {
      brokerageAmount = (quantity * rate * selectedBroker.commissionRate) / 100;
    }
    
    // Calculate total amount
    const subtotal = quantity * rate;
    const totalAmount = subtotal + transportCost + brokerageAmount;
    
    setFormData(prev => ({
      ...prev,
      netWeight,
      brokerageAmount,
      totalAmount,
      billAmount: prev.billAmount || totalAmount
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.lotNumber) {
      toast.error("Please select a lot number");
      return;
    }
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (parseFloat(formData.quantity.toString()) <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (parseFloat(formData.rate.toString()) <= 0) {
      toast.error("Rate must be greater than 0");
      return;
    }
    
    // Prepare submission data
    const salesData = {
      ...formData,
      quantity: parseFloat(formData.quantity.toString()),
      netWeight: parseFloat(formData.netWeight.toString()),
      rate: parseFloat(formData.rate.toString()),
      transportCost: parseFloat(formData.transportCost.toString()),
      brokerageAmount: parseFloat(formData.brokerageAmount.toString()),
      totalAmount: parseFloat(formData.totalAmount.toString()),
      billAmount: formData.billAmount ? parseFloat(formData.billAmount.toString()) : parseFloat(formData.totalAmount.toString()),
      customer: customers.find((c) => c.id === formData.customerId)?.name,
      broker: brokers.find((b) => b.id === formData.brokerId)?.name,
      transporter: transporters.find((t) => t.id === formData.transporterId)?.name
    };
    
    onSubmit(salesData);
  };
  
  // Handlers for adding new entities
  const handleAddNewCustomer = () => {
    if (!newCustomerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    
    const newCustomer = {
      id: `customer-${uuidv4()}`,
      name: newCustomerName.trim(),
      balance: 0
    };
    
    addCustomer(newCustomer);
    loadData();
    setFormData(prev => ({ ...prev, customerId: newCustomer.id }));
    setShowAddCustomerDialog(false);
    toast.success("New customer added successfully");
    setNewCustomerName("");
  };
  
  const handleAddNewBroker = () => {
    if (!newBrokerName.trim()) {
      toast.error("Broker name is required");
      return;
    }
    
    const newBroker = {
      id: `broker-${uuidv4()}`,
      name: newBrokerName.trim(),
      commissionRate: parseFloat(newBrokerCommission) || 1,
      balance: 0
    };
    
    addBroker(newBroker);
    loadData();
    setFormData(prev => ({ ...prev, brokerId: newBroker.id }));
    setShowAddBrokerDialog(false);
    toast.success("New broker added successfully");
    setNewBrokerName("");
    setNewBrokerCommission("1");
  };
  
  const handleAddNewTransporter = () => {
    if (!newTransporterName.trim()) {
      toast.error("Transporter name is required");
      return;
    }
    
    const newTransporter = {
      id: `transporter-${uuidv4()}`,
      name: newTransporterName.trim(),
      vehicleNumber: newTransporterVehicle,
      balance: 0
    };
    
    addTransporter(newTransporter);
    loadData();
    setFormData(prev => ({ ...prev, transporterId: newTransporter.id }));
    setShowAddTransporterDialog(false);
    toast.success("New transporter added successfully");
    setNewTransporterName("");
    setNewTransporterVehicle("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sale Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lotNumber">Lot Number</Label>
              <Select
                value={formData.lotNumber}
                onValueChange={(value) => handleSelectChange('lotNumber', value)}
              >
                <SelectTrigger id="lotNumber">
                  <SelectValue placeholder="Select lot number" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {inventory.map(item => (
                    <SelectItem key={item.id} value={item.lotNumber}>
                      {item.lotNumber} ({item.remainingQuantity} bags)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange('location', value)}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="billNumber">Bill Number</Label>
              <Input 
                id="billNumber"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleInputChange}
                placeholder="Enter bill number"
              />
            </div>
            
            <div>
              <Label htmlFor="billAmount">Bill Amount (₹)</Label>
              <Input 
                id="billAmount"
                name="billAmount"
                type="number"
                value={formData.billAmount}
                onChange={handleInputChange}
                placeholder="Enter bill amount"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Parties Section */}
      <Card>
        <CardHeader>
          <CardTitle>Parties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="customerId">Customer</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddCustomerDialog(true)}
                  className="h-6 px-2 text-xs"
                >
                  + Add New
                </Button>
              </div>
              <Select
                value={formData.customerId}
                onValueChange={(value) => handleSelectChange('customerId', value)}
              >
                <SelectTrigger id="customerId">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="brokerId">Broker</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddBrokerDialog(true)}
                  className="h-6 px-2 text-xs"
                >
                  + Add New
                </Button>
              </div>
              <Select
                value={formData.brokerId}
                onValueChange={(value) => handleSelectChange('brokerId', value)}
              >
                <SelectTrigger id="brokerId">
                  <SelectValue placeholder="Select broker (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {brokers.map(broker => (
                    <SelectItem key={broker.id} value={broker.id}>{broker.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <Label htmlFor="transporterId">Transporter</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddTransporterDialog(true)}
                  className="h-6 px-2 text-xs"
                >
                  + Add New
                </Button>
              </div>
              <Select
                value={formData.transporterId}
                onValueChange={(value) => handleSelectChange('transporterId', value)}
              >
                <SelectTrigger id="transporterId">
                  <SelectValue placeholder="Select transporter (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {transporters.map(transporter => (
                    <SelectItem key={transporter.id} value={transporter.id}>{transporter.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="transportCost">Transport Cost (₹)</Label>
              <Input
                id="transportCost"
                name="transportCost"
                type="number"
                value={formData.transportCost}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Item Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity (Bags)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                max={maxQuantity}
                required
              />
              {maxQuantity > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Max: {maxQuantity} bags</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="netWeight">Net Weight (kg)</Label>
              <Input
                id="netWeight"
                name="netWeight"
                type="number"
                value={formData.netWeight}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="rate">Rate per kg (₹)</Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes"
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹ {((parseFloat(formData.quantity.toString()) || 0) * (parseFloat(formData.rate.toString()) || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport Cost:</span>
                <span>₹ {(parseFloat(formData.transportCost.toString()) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Brokerage:</span>
                <span>₹ {(parseFloat(formData.brokerageAmount.toString()) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹ {(parseFloat(formData.totalAmount.toString()) || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {initialData && onPrint && (
          <Button type="button" variant="outline" onClick={onPrint}>
            Print
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Update Sale' : 'Add Sale'}
        </Button>
      </div>
      
      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newCustomerName">Customer Name</Label>
              <Input 
                id="newCustomerName"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewCustomer}>Add Customer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Broker Dialog */}
      <Dialog open={showAddBrokerDialog} onOpenChange={setShowAddBrokerDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Broker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newBrokerName">Broker Name</Label>
              <Input 
                id="newBrokerName"
                value={newBrokerName}
                onChange={(e) => setNewBrokerName(e.target.value)}
                placeholder="Enter broker name"
              />
            </div>
            <div>
              <Label htmlFor="newBrokerCommission">Commission Rate (%)</Label>
              <Input 
                id="newBrokerCommission"
                type="number"
                value={newBrokerCommission}
                onChange={(e) => setNewBrokerCommission(e.target.value)}
                placeholder="Enter commission percentage"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddBrokerDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewBroker}>Add Broker</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Transporter Dialog */}
      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newTransporterName">Transporter Name</Label>
              <Input 
                id="newTransporterName"
                value={newTransporterName}
                onChange={(e) => setNewTransporterName(e.target.value)}
                placeholder="Enter transporter name"
              />
            </div>
            <div>
              <Label htmlFor="newTransporterVehicle">Vehicle Number</Label>
              <Input 
                id="newTransporterVehicle"
                value={newTransporterVehicle}
                onChange={(e) => setNewTransporterVehicle(e.target.value)}
                placeholder="Enter vehicle number (optional)"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTransporterDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewTransporter}>Add Transporter</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default SimpleSalesForm;
