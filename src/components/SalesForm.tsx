import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Plus, Printer, Save, Edit2 } from "lucide-react";
import stringSimilarity from "string-similarity";
import {
  getCustomers,
  getBrokers,
  getTransporters,
  getInventory,
  addCustomer,
  addBroker,
  addTransporter,
  getLocations
} from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  billNumber: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().optional(),
  transportRate: z.coerce.number().min(0, "Transport rate must be valid").optional(),
  location: z.string().optional(),
  brokerId: z.string().optional(),
  brokerageType: z.enum(["percentage", "fixed"]).optional(),
  brokerageValue: z.coerce.number().min(0, "Brokerage value must be valid").optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SalesFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onPrint?: () => void;
}

const SalesForm = ({ onSubmit, initialData, onPrint }: SalesFormProps) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newCustomerAddress, setNewCustomerAddress] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerAddress, setNewBrokerAddress] = useState<string>("");
  const [newBrokerRate, setNewBrokerRate] = useState<number>(1);
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterAddress, setNewTransporterAddress] = useState<string>("");
  const [customerOutstandingBalance, setCustomerOutstandingBalance] = useState<number>(0);
  const [brokerOutstandingBalance, setBrokerOutstandingBalance] = useState<number>(0);
  const [showOutOfStockDialog, setShowOutOfStockDialog] = useState<boolean>(false);
  const [showSaveOptionsDialog, setShowSaveOptionsDialog] = useState<boolean>(false);
  const [showSimilarCustomerDialog, setShowSimilarCustomerDialog] = useState<boolean>(false);
  const [similarCustomer, setSimilarCustomer] = useState<any>(null);
  const [enteredCustomerName, setEnteredCustomerName] = useState<string>("");
  const [formData, setFormData] = useState<any>(null);
  
  const defaultValues = initialData ? {
    date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
    lotNumber: initialData.lotNumber || "",
    quantity: initialData.quantity || 0,
    billNumber: initialData.billNumber || "",
    customerId: initialData.customerId || "",
    netWeight: initialData.netWeight || 0,
    rate: initialData.rate || 0,
    transporterId: initialData.transporterId || "",
    transportRate: initialData.transportRate || 0,
    location: initialData.location || "",
    brokerId: initialData.brokerId || "",
    brokerageType: initialData.brokerageType || "percentage",
    brokerageValue: initialData.brokerageType === "percentage" ? 
      (initialData.brokerageAmount ? (initialData.brokerageAmount / initialData.totalAmount * 100) : 1) : 
      initialData.brokerageAmount || 0,
    notes: initialData.notes || "",
  } : {
    date: format(new Date(), 'yyyy-MM-dd'),
    lotNumber: "",
    quantity: 0,
    billNumber: "",
    customerId: "",
    netWeight: 0,
    rate: 0,
    transporterId: "",
    transportRate: 0,
    location: "",
    brokerId: "",
    brokerageType: "percentage",
    brokerageValue: 1,
    notes: "",
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    loadData();
    
    if (initialData?.brokerId) {
      setShowBrokerage(true);
    }
  }, []);

  const loadData = () => {
    setCustomers(getCustomers() || []);
    setBrokers(getBrokers() || []);
    setTransporters(getTransporters() || []);
    setInventory((getInventory() || []).filter(item => !item.isDeleted && item.quantity > 0));
    setLocations(getLocations() || []);
  };

  useEffect(() => {
    if (initialData) {
      setTotalAmount(initialData.totalAmount || 0);
      setNetAmount(initialData.totalAmount || 0);
      setTransportCost(initialData.transportCost || 0);
      setBrokerageAmount(initialData.brokerageAmount || 0);
      
      if (initialData.lotNumber) {
        const invItem = inventory.find(item => item.lotNumber === initialData.lotNumber);
        if (invItem) {
          setAvailableQuantity(invItem.quantity + initialData.quantity);
        }
      }
    }
  }, [initialData, inventory]);

  useEffect(() => {
    const lotNumber = form.watch("lotNumber");
    if (lotNumber) {
      const invItem = inventory.find(item => item.lotNumber === lotNumber);
      if (invItem) {
        const additionalQty = initialData && initialData.lotNumber === lotNumber ? initialData.quantity : 0;
        setAvailableQuantity(invItem.quantity + additionalQty);
      } else {
        setAvailableQuantity(0);
      }
    }
  }, [form.watch("lotNumber"), inventory, initialData]);

  useEffect(() => {
    const customerId = form.watch("customerId");
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setCustomerOutstandingBalance(customer.balance);
      } else {
        setCustomerOutstandingBalance(0);
      }
    } else {
      setCustomerOutstandingBalance(0);
    }
  }, [form.watch("customerId"), customers]);

  useEffect(() => {
    const brokerId = form.watch("brokerId");
    if (brokerId) {
      const broker = brokers.find(b => b.id === brokerId);
      if (broker) {
        setBrokerOutstandingBalance(broker.balance);
      } else {
        setBrokerOutstandingBalance(0);
      }
    } else {
      setBrokerOutstandingBalance(0);
    }
  }, [form.watch("brokerId"), brokers]);

  useEffect(() => {
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
    const transportRate = values.transportRate || 0;
    
    const calculatedTransportCost = netWeight * (transportRate || 0);
    setTransportCost(calculatedTransportCost);
    
    const calculatedTotalAmount = netWeight * rate;
    setTotalAmount(calculatedTotalAmount);
    
    let calculatedBrokerageAmount = 0;
    if (showBrokerage && values.brokerId) {
      const brokerageValue = values.brokerageValue || 0;
      if (values.brokerageType === "percentage") {
        calculatedBrokerageAmount = (calculatedTotalAmount * brokerageValue) / 100;
      } else {
        calculatedBrokerageAmount = brokerageValue;
      }
    }
    setBrokerageAmount(calculatedBrokerageAmount);
    
    setNetAmount(calculatedTotalAmount);
  }, [form.watch(), showBrokerage]);

  const checkSimilarCustomerNames = (name: string) => {
    if (!name || name.trim().length < 2) return false;

    const normalizedName = name.toLowerCase().trim();
    
    for (const customer of customers) {
      const customerName = customer.name.toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(normalizedName, customerName);
      
      // Check for high similarity but not exact match
      if (similarity > 0.7 && similarity < 1) {
        setSimilarCustomer(customer);
        setEnteredCustomerName(name);
        setShowSimilarCustomerDialog(true);
        return true;
      }
    }
    
    return false;
  };

  const handleFormSubmit = (data: FormData) => {
    // Check if the lot is out of stock
    const selectedLot = inventory.find(item => item.lotNumber === data.lotNumber);
    
    if (selectedLot) {
      const availableQty = initialData && initialData.lotNumber === data.lotNumber 
        ? selectedLot.quantity + initialData.quantity 
        : selectedLot.quantity;
        
      if (data.quantity > availableQty) {
        setShowOutOfStockDialog(true);
        return;
      }
    } else {
      toast.error(`Lot ${data.lotNumber} is not available in inventory`);
      return;
    }
    
    // Store form data for later submission
    setFormData(data);
    
    // Show save options dialog
    setShowSaveOptionsDialog(true);
  };

  const processSale = (data: FormData, action: 'print' | 'save' | 'edit_later') => {
    const customer = customers.find(c => c.id === data.customerId);
    
    let transporterName = "";
    if (data.transporterId && data.transporterId !== "none" && data.transporterId !== "self") {
      transporterName = transporters.find(t => t.id === data.transporterId)?.name || "";
    }
    
    const submitData = {
      ...data,
      customer: customer ? customer.name : data.customerId,
      customerId: data.customerId,
      transporter: transporterName,
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || "" : "",
      brokerageAmount: showBrokerage && data.brokerId ? brokerageAmount : 0,
      brokerageType: data.brokerageType || "percentage",
      totalAmount,
      netAmount: totalAmount,
      transportCost,
      billAmount: data.billNumber ? totalAmount : 0,
      id: initialData?.id || `sale-${Date.now()}`,
      amount: totalAmount,
    };
    
    // Close the dialog
    setShowSaveOptionsDialog(false);
    
    // Submit the data
    onSubmit(submitData);
    
    // Handle specific actions
    if (action === 'print' && onPrint) {
      setTimeout(() => {
        onPrint();
      }, 500);
    } else if (action === 'edit_later') {
      toast.success("Sale saved as draft. You can edit it later.");
    }
  };

  const handleAddNewCustomer = () => {
    if (!newCustomerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    
    const newCustomer = {
      id: `customer-${Date.now()}`,
      name: newCustomerName.trim(),
      address: newCustomerAddress.trim(),
      balance: 0
    };
    
    addCustomer(newCustomer);
    loadData();
    form.setValue("customerId", newCustomer.id);
    setShowAddCustomerDialog(false);
    setNewCustomerName("");
    setNewCustomerAddress("");
    toast.success("New customer added successfully");
  };

  const handleAddNewBroker = () => {
    if (!newBrokerName.trim()) {
      toast.error("Broker name is required");
      return;
    }
    
    const newBroker = {
      id: `broker-${Date.now()}`,
      name: newBrokerName.trim(),
      address: newBrokerAddress.trim(),
      commissionRate: newBrokerRate,
      balance: 0
    };
    
    addBroker(newBroker);
    loadData();
    form.setValue("brokerId", newBroker.id);
    setShowBrokerage(true);
    setShowAddBrokerDialog(false);
    setNewBrokerName("");
    setNewBrokerAddress("");
    setNewBrokerRate(1);
    toast.success("New broker added successfully");
  };

  const handleAddNewTransporter = () => {
    if (!newTransporterName.trim()) {
      toast.error("Transporter name is required");
      return;
    }
    
    const newTransporter = {
      id: `transporter-${Date.now()}`,
      name: newTransporterName.trim(),
      address: newTransporterAddress.trim(),
      balance: 0
    };
    
    addTransporter(newTransporter);
    loadData();
    form.setValue("transporterId", newTransporter.id);
    setShowAddTransporterDialog(false);
    setNewTransporterName("");
    setNewTransporterAddress("");
    toast.success("New transporter added successfully");
  };

  const useSuggestedCustomer = () => {
    if (similarCustomer) {
      form.setValue("customerId", similarCustomer.id);
    }
    setShowSimilarCustomerDialog(false);
  };

  // Transform data for combobox - ensure we never pass undefined to map functions
  const customerOptions = (customers || []).map(customer => ({
    value: customer.id,
    label: customer.name
  }));

  const brokerOptions = (brokers || []).map(broker => ({
    value: broker.id,
    label: broker.name
  }));

  const transporterOptions = (transporters || []).map(transporter => ({
    value: transporter.id,
    label: transporter.name
  }));

  const inventoryOptions = (inventory || []).map(item => ({
    value: item.lotNumber,
    label: `${item.lotNumber} (${item.quantity} bags available) - ${item.location}`
  }));

  const locationOptions = (locations || []).map(location => ({
    value: location,
    label: location
  }));

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer (Party)</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={customerOptions}
                        {...field}
                        onSelect={(value) => {
                          field.onChange(value);
                          const customer = customers.find(c => c.id === value);
                          if (customer) {
                            setCustomerOutstandingBalance(customer.balance);
                          }
                        }}
                        placeholder="Select customer"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => setShowAddCustomerDialog(true)}
                      title="Add new customer"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormMessage />
                  {customerOutstandingBalance !== 0 && (
                    <p className={`text-xs mt-1 ${customerOutstandingBalance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Outstanding Balance: 
                      <span className="font-semibold"> ₹{Math.abs(customerOutstandingBalance).toFixed(2)}</span> 
                      {customerOutstandingBalance > 0 ? ' (Credit)' : ' (Debit)'}
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="brokerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker (Dalal) (Optional)</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={brokerOptions}
                        {...field}
                        onSelect={(value) => {
                          field.onChange(value);
                          setShowBrokerage(!!value);
                          const broker = brokers.find(b => b.id === value);
                          if (broker) {
                            setBrokerOutstandingBalance(broker.balance);
                          }
                        }}
                        placeholder="Select broker (optional)"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => setShowAddBrokerDialog(true)}
                      title="Add new broker"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormMessage />
                  {brokerOutstandingBalance !== 0 && (
                    <p className={`text-xs mt-1 ${brokerOutstandingBalance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Broker Balance: 
                      <span className="font-semibold"> ₹{Math.abs(brokerOutstandingBalance).toFixed(2)}</span> 
                      {brokerOutstandingBalance > 0 ? ' (Credit)' : ' (Debit)'}
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Number (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter bill number if applicable" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Number (Vakkal)</FormLabel>
                  <FormControl>
                    <Combobox 
                      options={inventoryOptions}
                      {...field}
                      placeholder="Select lot number"
                    />
                  </FormControl>
                  <FormMessage />
                  {availableQuantity > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Available: {availableQuantity} bags
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (Bags)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0" max={availableQuantity} />
                  </FormControl>
                  <FormMessage />
                  {form.watch('quantity') > availableQuantity && (
                    <p className="text-xs text-red-600 mt-1">
                      Exceeds available quantity
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="netWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per kg (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transporterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter (Optional)</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={[
                          { value: "none", label: "None" },
                          { value: "self", label: "Self" },
                          ...transporterOptions
                        ]}
                        {...field}
                        placeholder="Select transporter (optional)"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => setShowAddTransporterDialog(true)}
                      title="Add new transporter"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transportRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Rate per kg (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      placeholder="0.00"
                      step="0.01"
                      disabled={!form.watch('transporterId') || form.watch('transporterId') === 'none' || form.watch('transporterId') === 'self'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Combobox 
                      options={[
                        { value: "none", label: "None" },
                        ...locationOptions
                      ]}
                      {...field}
                      placeholder="Select location (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-full">
              {showBrokerage && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50 mb-4">
                  <FormField
                    control={form.control}
                    name="brokerageType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Brokerage Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brokerageValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("brokerageType") === "percentage" 
                            ? "Brokerage Percentage (%)" 
                            : "Fixed Amount (₹)"}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            step="0.01"
                            placeholder={form.watch("brokerageType") === "percentage" ? "1.00" : "0.00"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium">Calculated Brokerage (₹)</label>
                    <Input 
                      type="number" 
                      value={brokerageAmount.toFixed(2)} 
                      readOnly
                      className="bg-gray-100"
                    />
                    {form.watch("brokerageType") === "percentage" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {form.watch("brokerageValue") || 0}% of ₹{totalAmount.toFixed(2)} = ₹{brokerageAmount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transport Cost</p>
                <p className="font-bold">₹{transportCost.toFixed(2)}</p>
              </div>
              {showBrokerage && (
                <div>
                  <p className="text-sm text-gray-500">Brokerage (Recorded)</p>
                  <p className="font-bold">₹{brokerageAmount.toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Net Amount</p>
                <p className="font-bold">₹{netAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} placeholder="Enter any additional notes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            {initialData && onPrint && (
              <Button type="button" variant="outline" onClick={onPrint}>
                Print Receipt
              </Button>
            )}
            <Button type="submit" size="lg">
              {initialData ? "Update Sale" : "Add Sale"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Add New Customer Dialog */}
      <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Customer Name</FormLabel>
              <Input 
                placeholder="Enter customer name" 
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Address (Optional)</FormLabel>
              <Textarea 
                placeholder="Enter address (optional)" 
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Broker Dialog */}
      <Dialog open={showAddBrokerDialog} onOpenChange={setShowAddBrokerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Broker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Broker Name</FormLabel>
              <Input 
                placeholder="Enter broker name" 
                value={newBrokerName}
                onChange={(e) => setNewBrokerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Address (Optional)</FormLabel>
              <Textarea 
                placeholder="Enter address (optional)" 
                value={newBrokerAddress}
                onChange={(e) => setNewBrokerAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Default Commission Rate (%)</FormLabel>
              <Input 
                type="number"
                placeholder="Enter default commission rate" 
                value={newBrokerRate}
                onChange={(e) => setNewBrokerRate(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBrokerDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewBroker}>Add Broker</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Transporter Dialog */}
      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Transporter Name</FormLabel>
              <Input 
                placeholder="Enter transporter name" 
                value={newTransporterName}
                onChange={(e) => setNewTransporterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Address (Optional)</FormLabel>
              <Textarea 
                placeholder="Enter address (optional)" 
                value={newTransporterAddress}
                onChange={(e) => setNewTransporterAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTransporterDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewTransporter}>Add Transporter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Out of Stock Dialog */}
      <Dialog open={showOutOfStockDialog} onOpenChange={setShowOutOfStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out of Stock</DialogTitle>
            <DialogDescription>
              Lot {form.watch('lotNumber')} does not have enough quantity. Available: {availableQuantity} bags, Requested: {form.watch('quantity')} bags.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowOutOfStockDialog(false)}>
              Change Quantity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Similar Customer Dialog */}
      <Dialog open={showSimilarCustomerDialog} onOpenChange={setShowSimilarCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Similar Customer Name Found</DialogTitle>
            <DialogDescription>
              <span className="block mt-2">क्या आप "{similarCustomer?.name}" दर्ज करना चाहते हैं?</span>
              <span className="block mt-1">आप نے اسی طرح کا نام درج کیا ہے: "{enteredCustomerName}"</span>
              <span className="block mt-2">Did you mean "{similarCustomer?.name}"?</span>
              <span className="block mt-1">You've entered a similar name: "{enteredCustomerName}"</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSimilarCustomerDialog(false)}>
              Use My Entry
            </Button>
            <Button onClick={useSuggestedCustomer}>
              Use "{similarCustomer?.name}"
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Options Dialog */}
      <Dialog open={showSaveOptionsDialog} onOpenChange={setShowSaveOptionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Options</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <Button onClick={() => processSale(formData, 'print')} className="w-full flex items-center justify-center gap-2">
                <Printer size={16} /> Print Chitthi
              </Button>
              <Button onClick={() => processSale(formData, 'save')} variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Save size={16} /> Save Only
              </Button>
              <Button onClick={() => processSale(formData, 'edit_later')} variant="outline" className="w-full flex items-center justify-center gap-2">
                <Edit2 size={16} /> Edit & Save Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SalesForm;
