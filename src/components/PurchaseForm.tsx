
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  getAgents,
  getSuppliers,
  getTransporters,
  getBrokers,
  addCustomer,
  checkDuplicateLot,
  getPurchases,
  getLocations,
  addBroker,
  addTransporter
} from "@/services/storageService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import stringSimilarity from "string-similarity";
import { Plus } from "lucide-react";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  brokerId: z.string().optional(),
  party: z.string().min(1, "Party is required"),
  location: z.string().min(1, "Location is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().min(1, "Transporter is required"),
  transportRate: z.coerce.number().min(0, "Transport rate must be valid"),
  expenses: z.coerce.number().min(0, "Expenses must be valid"),
  brokerageType: z.enum(["percentage", "fixed"]).optional(),
  brokerageValue: z.coerce.number().min(0, "Brokerage value must be valid").optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PurchaseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const PurchaseForm = ({ onSubmit, initialData }: PurchaseFormProps) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  const [newPartyName, setNewPartyName] = useState<string>("");
  const [newPartyAddress, setNewPartyAddress] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerAddress, setNewBrokerAddress] = useState<string>("");
  const [newBrokerRate, setNewBrokerRate] = useState<number>(1);
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterAddress, setNewTransporterAddress] = useState<string>("");
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  const [showSimilarPartyDialog, setShowSimilarPartyDialog] = useState<boolean>(false);
  const [similarParty, setSimilarParty] = useState<any>(null);
  const [enteredPartyName, setEnteredPartyName] = useState<string>("");
  
  const defaultValues = initialData ? {
    date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
    lotNumber: initialData.lotNumber || "",
    quantity: initialData.quantity || 0,
    brokerId: initialData.brokerId || "",
    party: initialData.party || "",
    location: initialData.location || "",
    netWeight: initialData.netWeight || 0,
    rate: initialData.rate || 0,
    transporterId: initialData.transporterId || "",
    transportRate: initialData.transportRate || 0,
    expenses: initialData.expenses || 0,
    brokerageType: initialData.brokerageType || "percentage",
    brokerageValue: initialData.brokerageType === "percentage" ? 
      (initialData.brokerageAmount ? (initialData.brokerageAmount / initialData.totalAmount * 100) : 1) : 
      initialData.brokerageAmount || 0,
    notes: initialData.notes || "",
  } : {
    date: format(new Date(), 'yyyy-MM-dd'),
    lotNumber: "",
    quantity: 0,
    brokerId: "",
    party: "",
    location: "",
    netWeight: 0,
    rate: 0,
    transporterId: "",
    transportRate: 0,
    expenses: 0,
    brokerageType: "percentage",
    brokerageValue: 1,
    notes: "",
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    loadData();
    
    if (initialData?.brokerId) {
      setShowBrokerage(true);
    }
  }, [initialData]);

  const loadData = () => {
    setAgents(getAgents());
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
    setBrokers(getBrokers());
    setLocations(getLocations());
  };

  useEffect(() => {
    if (initialData) {
      setTotalAmount(initialData.totalAmount || 0);
      setTotalAfterExpenses(initialData.totalAfterExpenses || 0);
      setRatePerKgAfterExpenses(initialData.ratePerKgAfterExpenses || 0);
      setTransportCost(initialData.transportCost || 0);
      setBrokerageAmount(initialData.brokerageAmount || 0);
    }
  }, [initialData]);

  useEffect(() => {
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
    const expenses = values.expenses || 0;
    const transportRate = values.transportRate || 0;
    
    const calculatedTransportCost = netWeight * transportRate;
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
    
    const calculatedTotalAfterExpenses = calculatedTotalAmount + expenses + calculatedTransportCost + calculatedBrokerageAmount;
    setTotalAfterExpenses(calculatedTotalAfterExpenses);
    
    const calculatedRatePerKg = netWeight > 0 ? calculatedTotalAfterExpenses / netWeight : 0;
    setRatePerKgAfterExpenses(calculatedRatePerKg);
  }, [form.watch(), showBrokerage]);

  const checkSimilarPartyNames = (name: string) => {
    if (!name || name.trim().length < 2) return false;

    const normalizedName = name.toLowerCase().trim();
    const allParties = [...suppliers, ...agents];
    
    for (const party of allParties) {
      const partyName = party.name.toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(normalizedName, partyName);
      
      // Check for high similarity but not exact match
      if (similarity > 0.7 && similarity < 1) {
        setSimilarParty(party);
        setEnteredPartyName(name);
        setShowSimilarPartyDialog(true);
        return true;
      }
    }
    
    return false;
  };

  const handleFormSubmit = (data: FormData) => {
    // Check for duplicate lot number
    const isDuplicateLot = checkDuplicateLot(data.lotNumber);

    if (isDuplicateLot && !initialData) {
      const existingPurchase = getPurchases().find(p => p.lotNumber === data.lotNumber && !p.isDeleted);
      if (existingPurchase) {
        setDuplicateLotInfo(existingPurchase);
        setShowDuplicateLotDialog(true);
        return;
      }
    }
    
    // If we're adding a new party
    if (data.party && !suppliers.some(s => s.name === data.party)) {
      const newCustomer = {
        id: Date.now().toString(),
        name: data.party,
        address: "",
        balance: 0
      };
      addCustomer(newCustomer);
    }
    
    submitFormData(data);
  };

  const submitFormData = (data: FormData) => {
    const submitData = {
      ...data,
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || "" : "",
      transporter: transporters.find(t => t.id === data.transporterId)?.name || "",
      totalAmount,
      transportCost,
      expenses: data.expenses,
      brokerageAmount: showBrokerage && data.brokerId ? brokerageAmount : 0,
      brokerageType: data.brokerageType || "percentage",
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    onSubmit(submitData);
  };

  const continueDespiteDuplicate = () => {
    setShowDuplicateLotDialog(false);
    const data = form.getValues();
    submitFormData(data);
  };

  const handleAddNewParty = () => {
    if (!newPartyName.trim()) {
      toast.error("Party name is required");
      return;
    }
    
    const newParty = {
      id: `party-${Date.now()}`,
      name: newPartyName.trim(),
      address: newPartyAddress.trim(),
      balance: 0
    };
    
    addCustomer(newParty);
    loadData();
    form.setValue("party", newPartyName.trim());
    setShowAddPartyDialog(false);
    setNewPartyName("");
    setNewPartyAddress("");
    toast.success("New party added successfully");
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

  const useSuggestedParty = () => {
    if (similarParty) {
      form.setValue("party", similarParty.name);
    }
    setShowSimilarPartyDialog(false);
  };

  // Transform data for combobox
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.name,
    label: supplier.name
  }));

  const brokerOptions = brokers.map(broker => ({
    value: broker.id,
    label: broker.name
  }));

  const transporterOptions = transporters.map(transporter => ({
    value: transporter.id,
    label: transporter.name
  }));

  const locationOptions = locations.map(location => ({
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
              name="party"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={supplierOptions}
                        {...field}
                        onInputChange={(value) => {
                          field.onChange(value);
                          checkSimilarPartyNames(value);
                        }}
                        placeholder="Select or type party name"
                        className="flex-1"
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      onClick={() => setShowAddPartyDialog(true)}
                      title="Add new party"
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
              name="brokerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker (Optional)</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={brokerOptions}
                        {...field}
                        onSelect={(value) => {
                          field.onChange(value);
                          setShowBrokerage(!!value);
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
                    <Input {...field} placeholder="Enter lot number" />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="number" {...field} placeholder="0" />
                  </FormControl>
                  <FormMessage />
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Combobox 
                      options={locationOptions}
                      {...field}
                      placeholder="Select location"
                    />
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
                  <FormLabel>Transporter</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl className="flex-1">
                      <Combobox 
                        options={transporterOptions}
                        {...field}
                        placeholder="Select transporter"
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
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <label className="text-sm font-medium">Transport Cost (₹)</label>
              <Input 
                type="number" 
                value={transportCost.toFixed(2)} 
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Transport Rate × Net Weight</p>
            </div>
            
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Expenses (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="md:col-span-2">
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
                  <p className="text-sm text-gray-500">Brokerage</p>
                  <p className="font-bold">₹{brokerageAmount.toFixed(2)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Additional Expenses</p>
                <p className="font-bold">₹{form.watch("expenses") || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total After Expenses</p>
                <p className="font-bold">₹{totalAfterExpenses.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rate/kg After Expenses</p>
                <p className="font-bold">₹{ratePerKgAfterExpenses.toFixed(2)}</p>
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
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {initialData ? "Update Purchase" : "Add Purchase"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Add New Party Dialog */}
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel>Party Name</FormLabel>
              <Input 
                placeholder="Enter party name" 
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Address (Optional)</FormLabel>
              <Textarea 
                placeholder="Enter address (optional)" 
                value={newPartyAddress}
                onChange={(e) => setNewPartyAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewParty}>Add Party</Button>
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

      {/* Duplicate Lot Dialog */}
      <Dialog open={showDuplicateLotDialog} onOpenChange={setShowDuplicateLotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Lot Number</DialogTitle>
            <DialogDescription>
              You've already added this lot number on {duplicateLotInfo && format(new Date(duplicateLotInfo.date), "dd MMM yyyy")}. 
              Is this the same lot or a different one?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p>Previous lot details:</p>
              {duplicateLotInfo && (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Party: {duplicateLotInfo.party}</li>
                  <li>Quantity: {duplicateLotInfo.quantity} bags</li>
                  <li>Net Weight: {duplicateLotInfo.netWeight} kg</li>
                  <li>Rate: ₹{duplicateLotInfo.rate} per kg</li>
                </ul>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateLotDialog(false)}>
              Change Lot Number
            </Button>
            <Button onClick={continueDespiteDuplicate}>
              Continue Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Similar Party Dialog */}
      <Dialog open={showSimilarPartyDialog} onOpenChange={setShowSimilarPartyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Similar Party Name Found</DialogTitle>
            <DialogDescription>
              <span className="block mt-2">Did you mean "{similarParty?.name}"?</span>
              <span className="block mt-1">You've entered a similar name: "{enteredPartyName}"</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSimilarPartyDialog(false)}>
              Use My Entry
            </Button>
            <Button onClick={useSuggestedParty}>
              Use "{similarParty?.name}"
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PurchaseForm;
