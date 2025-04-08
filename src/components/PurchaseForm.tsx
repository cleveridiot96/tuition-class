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
  getAgents,
  getSuppliers,
  getTransporters,
  getBrokers,
  addCustomer,
  checkDuplicateLot
} from "@/services/storageService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  agentId: z.string().optional(),
  party: z.string().min(1, "Party is required"),
  location: z.string().min(1, "Location is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().min(1, "Transporter is required"),
  transportRate: z.coerce.number().min(0, "Transport rate must be valid"),
  expenses: z.coerce.number().min(0, "Expenses must be valid"),
  brokerId: z.string().optional(),
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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);
  
  const defaultValues = initialData ? {
    date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
    lotNumber: initialData.lotNumber || "",
    quantity: initialData.quantity || 0,
    agentId: initialData.agentId || "",
    party: initialData.party || "",
    location: initialData.location || "",
    netWeight: initialData.netWeight || 0,
    rate: initialData.rate || 0,
    transporterId: initialData.transporterId || "",
    transportRate: initialData.transportRate || 0,
    expenses: initialData.expenses || 0,
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
    agentId: "",
    party: "",
    location: "",
    netWeight: 0,
    rate: 0,
    transporterId: "",
    transportRate: 0,
    expenses: 0,
    brokerId: "",
    brokerageType: "percentage",
    brokerageValue: 1,
    notes: "",
  };
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    setAgents(getAgents());
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
    setBrokers(getBrokers());
    
    if (initialData?.brokerId) {
      setShowBrokerage(true);
    }
  }, [initialData]);

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

  const handleFormSubmit = (data: FormData) => {
    const isDuplicateLot = checkDuplicateLot(data.lotNumber);

    if (isDuplicateLot && !initialData) {
      form.setError("lotNumber", {
        type: "manual",
        message: "This lot number already exists"
      });
      return;
    }
    
    const submitData = {
      ...data,
      agent: data.agentId ? agents.find(a => a.id === data.agentId)?.name || "None" : "None",
      transporter: transporters.find(t => t.id === data.transporterId)?.name || "",
      totalAmount,
      transportCost,
      expenses: data.expenses,
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || "" : "",
      brokerageAmount: showBrokerage && data.brokerId ? brokerageAmount : 0,
      brokerageType: data.brokerageType || "percentage",
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    if (data.party && !suppliers.some(s => s.name === data.party)) {
      const newCustomer = {
        id: Date.now().toString(),
        name: data.party,
        address: "",
        balance: 0
      };
      addCustomer(newCustomer);
    }
    
    onSubmit(submitData);
  };

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
              name="lotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Number</FormLabel>
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
              name="agentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || "no-agent"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-agent">No Agent</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormControl>
                    <Input {...field} placeholder="Enter party name" />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Chiplun">Chiplun</SelectItem>
                      <SelectItem value="Sawantwadi">Sawantwadi</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="transporterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transporter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transporters.map((transporter) => (
                        <SelectItem key={transporter.id} value={transporter.id}>
                          {transporter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <div className="flex items-center mb-4">
                <input
                  id="showBrokerage"
                  type="checkbox"
                  checked={showBrokerage}
                  onChange={(e) => setShowBrokerage(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="showBrokerage" className="ml-2 text-sm font-medium text-gray-900">
                  Add Brokerage
                </label>
              </div>
              
              {showBrokerage && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50 mb-4">
                  <FormField
                    control={form.control}
                    name="brokerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broker</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select broker" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brokers.map((broker) => (
                              <SelectItem key={broker.id} value={broker.id}>
                                {broker.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                  
                  <div className="md:col-span-3">
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
    </Card>
  );
};

export default PurchaseForm;
