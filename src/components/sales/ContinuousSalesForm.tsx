
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-select";
import { Check, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCustomers, getBrokers, getTransporters, getLocations, getInventory } from '@/services/storageService';
import { toast } from "sonner";

const defaultFormState = {
  id: `sale-${Date.now()}`,
  date: new Date().toISOString().split('T')[0],
  lotNumber: '',
  customerId: '',
  brokerId: '',
  transporterId: '',
  quantity: 0,
  netWeight: 0,
  rate: 0,
  transportCost: 0,
  brokerageAmount: 0,
  billNumber: '',
  billAmount: null as number | null,
  notes: '',
  items: [],
  location: '',
  totalAmount: 0
};

interface ContinuousSalesFormProps {
  onCancel: () => void;
  onSubmit: (sale: any) => void;
  initialSale?: any;
}

const ContinuousSalesForm: React.FC<ContinuousSalesFormProps> = ({ onCancel, onSubmit, initialSale }) => {
  const [formState, setFormState] = useState(defaultFormState);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCutBill, setIsCutBill] = useState(false);
  const [bags, setBags] = useState<number>(0);
  const [weightPerBag, setWeightPerBag] = useState<number>(50);
  const [isManualWeight, setIsManualWeight] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load initial sale data if editing
  useEffect(() => {
    if (initialSale) {
      setFormState(initialSale);
      if (initialSale.lotNumber) {
        const item = inventory.find(i => i.lotNumber === initialSale.lotNumber);
        if (item) {
          setSelectedItem(item);
        }
      }
      setIsCutBill(initialSale.billAmount !== null);
      // Calculate bags based on weight
      if (initialSale.netWeight) {
        const calculatedBags = Math.round(initialSale.netWeight / 50);
        setBags(calculatedBags);
        setWeightPerBag(calculatedBags > 0 ? initialSale.netWeight / calculatedBags : 50);
      }
    }
  }, [initialSale, inventory]);

  // Update weight when bags or weightPerBag changes
  useEffect(() => {
    if (!isManualWeight && bags > 0) {
      const calculatedWeight = bags * weightPerBag;
      setFormState(prev => ({
        ...prev,
        netWeight: calculatedWeight
      }));
    }
  }, [bags, weightPerBag, isManualWeight]);

  const loadData = () => {
    try {
      const loadedCustomers = getCustomers() || [];
      const loadedBrokers = getBrokers() || [];
      const loadedTransporters = getTransporters() || [];
      const loadedLocations = getLocations() || ['Mumbai', 'Chiplun', 'Sawantwadi'];
      const loadedInventory = getInventory() || [];
      
      setCustomers(loadedCustomers);
      setBrokers(loadedBrokers);
      setTransporters(loadedTransporters);
      setLocations(loadedLocations);
      setInventory(loadedInventory.filter(item => !item.isSoldOut && item.quantity > 0));
    } catch (error) {
      console.error("Error loading form data:", error);
      toast.error("Failed to load data");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric fields
    if (['quantity', 'rate', 'transportCost', 'brokerageAmount'].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormState(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleNetWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setIsManualWeight(true);
    setFormState(prev => ({ ...prev, netWeight: value }));
    
    // Update bags based on weight if weight per bag is valid
    if (weightPerBag > 0) {
      const calculatedBags = Math.round(value / weightPerBag);
      setBags(calculatedBags);
    }
  };

  const handleBagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setBags(value);
    setIsManualWeight(false);
  };

  const handleWeightPerBagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 50;
    setWeightPerBag(value);
    setIsManualWeight(false);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (name === 'lotNumber') {
      const selectedLot = inventory.find(item => item.lotNumber === value);
      if (selectedLot) {
        setSelectedItem(selectedLot);
        setFormState(prev => ({
          ...prev,
          quantity: 0,
          netWeight: 0
        }));
        setBags(0);
      }
    }
    
    if (name === 'brokerId') {
      const selectedBroker = brokers.find(b => b.id === value);
      if (selectedBroker && selectedBroker.commissionRate) {
        const subtotal = formState.quantity * formState.rate;
        const brokerageAmount = subtotal * (selectedBroker.commissionRate / 100);
        setFormState(prev => ({ ...prev, brokerageAmount }));
      }
    }

    // Clear error when customer or broker is selected
    if ((name === 'customerId' || name === 'brokerId') && value) {
      setErrorMessage(null);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    
    if (selectedItem) {
      // Ensure we don't exceed available quantity
      const maxQuantity = selectedItem.remainingQuantity || 0;
      const validQuantity = Math.min(value, maxQuantity);
      
      // Calculate weight based on the selected item's weight per bag
      let weightPerItem = 0;
      if (selectedItem.quantity > 0 && selectedItem.netWeight) {
        weightPerItem = selectedItem.netWeight / selectedItem.quantity;
      } else {
        weightPerItem = 50; // Default weight per bag
      }
      
      const netWeight = validQuantity * weightPerItem;
      
      setFormState(prev => ({
        ...prev,
        quantity: validQuantity,
        netWeight
      }));
      
      setBags(validQuantity);
      setWeightPerBag(weightPerItem);
    } else {
      setFormState(prev => ({ ...prev, quantity: value }));
      setBags(value);
    }
  };

  const handleBillAmountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setIsCutBill(enabled);
    
    if (!enabled) {
      setFormState(prev => ({ ...prev, billAmount: null }));
    } else {
      // Set default bill amount to the calculated total
      const subtotal = formState.quantity * formState.rate;
      const total = subtotal + parseFloat(formState.transportCost as any || 0) + parseFloat(formState.brokerageAmount as any || 0);
      setFormState(prev => ({ ...prev, billAmount: total }));
    }
  };

  const calculateSubtotal = () => {
    return formState.quantity * formState.rate;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost as any || 0);
    const brokerageAmount = parseFloat(formState.brokerageAmount as any || 0);
    return subtotal + transportCost + brokerageAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    // Validation
    if (!formState.lotNumber) {
      setErrorMessage("Please select a lot number");
      setIsSubmitting(false);
      return;
    }
    
    if (!formState.customerId && !formState.brokerId) {
      setErrorMessage("Either Customer or Broker must be specified");
      setIsSubmitting(false);
      return;
    }
    
    if (formState.quantity <= 0) {
      setErrorMessage("Quantity must be greater than 0");
      setIsSubmitting(false);
      return;
    }
    
    if (formState.netWeight <= 0) {
      setErrorMessage("Net weight must be greater than 0");
      setIsSubmitting(false);
      return;
    }
    
    if (formState.rate <= 0) {
      setErrorMessage("Rate must be greater than 0");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Calculate totals
      const subtotal = calculateSubtotal();
      const totalAmount = calculateTotal();
      const billAmount = isCutBill ? (formState.billAmount || totalAmount) : totalAmount;
      
      // Prepare final sale data
      const saleData = {
        ...formState,
        id: initialSale?.id || `sale-${Date.now()}`,
        totalAmount,
        billAmount,
        customer: formState.customerId ? customers.find(c => c.id === formState.customerId)?.name : undefined,
        broker: formState.brokerId ? brokers.find(b => b.id === formState.brokerId)?.name : undefined,
        transporter: formState.transporterId ? transporters.find(t => t.id === formState.transporterId)?.name : undefined,
        location: formState.location || 'Unknown',
        bags,
        weightPerBag
      };
      
      // Submit data
      onSubmit(saleData);
      toast.success(initialSale ? "Sale updated successfully" : "Sale added successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save sale");
      setIsSubmitting(false);
    }
  };

  // Create options for searchable select components
  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }));
  const brokerOptions = [
    { value: "", label: "None" },
    ...brokers.map(b => ({ value: b.id, label: `${b.name} (${b.commissionRate || 0}%)` }))
  ];
  const transporterOptions = [
    { value: "", label: "None" },
    ...transporters.map(t => ({ value: t.id, label: t.name }))
  ];
  const inventoryOptions = inventory.map(item => ({
    value: item.lotNumber,
    label: `${item.lotNumber} - ${item.productType} (${item.remainingQuantity} bags)`
  }));
  const locationOptions = locations.map(loc => ({ value: loc, label: loc }));

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardTitle>{initialSale ? 'Edit Sale' : 'New Sale'}</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor="billNumber">Bill Number</Label>
                  <Input
                    id="billNumber"
                    name="billNumber"
                    value={formState.billNumber}
                    onChange={handleInputChange}
                    placeholder="Enter bill number"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="billAmount">Bill Amount</Label>
                    <label className="text-xs flex items-center">
                      <input
                        type="checkbox"
                        checked={isCutBill}
                        onChange={handleBillAmountToggle}
                        className="mr-1"
                      />
                      Cut Bill
                    </label>
                  </div>
                  <Input
                    id="billAmount"
                    name="billAmount"
                    type="number"
                    disabled={!isCutBill}
                    value={formState.billAmount === null ? "" : formState.billAmount}
                    onChange={handleInputChange}
                    className={isCutBill ? "bg-yellow-50 border-yellow-300" : ""}
                    placeholder={isCutBill ? "Enter custom bill amount" : "Calculated automatically"}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lotNumber">Lot Number</Label>
                  <EnhancedSearchableSelect
                    options={inventoryOptions}
                    value={formState.lotNumber}
                    onValueChange={(value) => handleSelectChange('lotNumber', value)}
                    placeholder="Select lot number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <EnhancedSearchableSelect
                    options={locationOptions}
                    value={formState.location}
                    onValueChange={(value) => handleSelectChange('location', value)}
                    placeholder="Select location"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Parties</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer</Label>
                  <EnhancedSearchableSelect
                    options={customerOptions}
                    value={formState.customerId}
                    onValueChange={(value) => handleSelectChange('customerId', value)}
                    placeholder="Select customer"
                    masterType="customer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brokerId">Broker</Label>
                  <EnhancedSearchableSelect
                    options={brokerOptions}
                    value={formState.brokerId}
                    onValueChange={(value) => handleSelectChange('brokerId', value)}
                    placeholder="Select broker"
                    masterType="broker"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transporterId">Transporter</Label>
                  <EnhancedSearchableSelect
                    options={transporterOptions}
                    value={formState.transporterId}
                    onValueChange={(value) => handleSelectChange('transporterId', value)}
                    placeholder="Select transporter"
                    masterType="transporter"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Quantity & Rate</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bags">Number of Bags</Label>
                  <Input
                    id="bags"
                    type="number"
                    min="0"
                    step="1"
                    value={bags}
                    onChange={handleBagsChange}
                    placeholder="Enter number of bags"
                    className={selectedItem && bags > selectedItem.remainingQuantity ? "border-red-500" : ""}
                  />
                  {selectedItem && bags > selectedItem.remainingQuantity && (
                    <p className="text-xs text-red-500">
                      Exceeds available quantity of {selectedItem.remainingQuantity} bags
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weightPerBag">Weight per Bag (kg)</Label>
                  <Input
                    id="weightPerBag"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={weightPerBag}
                    onChange={handleWeightPerBagChange}
                    placeholder="Default: 50kg per bag"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Bags)</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formState.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    required
                    className={selectedItem && formState.quantity > selectedItem.remainingQuantity ? "border-red-500" : ""}
                  />
                  {selectedItem && (
                    <p className="text-xs text-gray-500">
                      Available: {selectedItem.remainingQuantity} bags
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="netWeight">Net Weight (kg)</Label>
                  <Input
                    id="netWeight"
                    name="netWeight"
                    type="number"
                    value={formState.netWeight}
                    onChange={handleNetWeightChange}
                    className={isManualWeight ? "border-amber-400" : ""}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  {isManualWeight && (
                    <p className="text-xs text-amber-600">Manual weight set</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate (per kg)</Label>
                  <Input
                    id="rate"
                    name="rate"
                    type="number"
                    value={formState.rate}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transportCost">Transport Cost</Label>
                  <Input
                    id="transportCost"
                    name="transportCost"
                    type="number"
                    value={formState.transportCost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brokerageAmount">Brokerage Amount</Label>
                  <Input
                    id="brokerageAmount"
                    name="brokerageAmount"
                    type="number"
                    value={formState.brokerageAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={!formState.brokerId}
                    className={!formState.brokerId ? "opacity-50" : ""}
                  />
                  {formState.brokerId && (
                    <p className="text-xs text-gray-500">
                      Broker: {brokers.find(b => b.id === formState.brokerId)?.name}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formState.notes}
                    onChange={handleInputChange}
                    placeholder="Add any additional notes"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Subtotal:</div>
                <div className="font-medium">₹ {calculateSubtotal().toFixed(2)}</div>
                
                <div className="text-gray-600">Transport Cost:</div>
                <div className="font-medium">₹ {parseFloat(formState.transportCost as any || 0).toFixed(2)}</div>
                
                {formState.brokerId && (
                  <>
                    <div className="text-gray-600">Brokerage Amount:</div>
                    <div className="font-medium">₹ {parseFloat(formState.brokerageAmount as any || 0).toFixed(2)}</div>
                  </>
                )}
                
                <div className="text-gray-600 font-bold">Total:</div>
                <div className="font-bold">₹ {calculateTotal().toFixed(2)}</div>
                
                {isCutBill && formState.billAmount !== null && (
                  <>
                    <div className="text-yellow-600 font-bold">Bill Amount (Cut):</div>
                    <div className="font-bold text-yellow-600">₹ {parseFloat(formState.billAmount as any).toFixed(2)}</div>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </ScrollArea>
      <CardFooter className="flex justify-end gap-2 border-t p-4 bg-gray-50">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              {initialSale ? 'Update Sale' : 'Add Sale'}
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContinuousSalesForm;
