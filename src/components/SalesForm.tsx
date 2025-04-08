
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getCustomers,
  getBrokers,
  getTransporters,
  getInventory,
} from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  billNumber: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().optional(), // Made optional
  transportRate: z.coerce.number().min(0, "Transport rate must be valid"),
  location: z.string().optional(), // Already optional
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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  
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
    setCustomers(getCustomers());
    setBrokers(getBrokers());
    setTransporters(getTransporters());
    setInventory(getInventory().filter(item => !item.isDeleted && item.quantity > 0));
    
    if (initialData?.brokerId) {
      setShowBrokerage(true);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setTotalAmount(initialData.totalAmount || 0);
      setNetAmount(initialData.netAmount || 0);
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
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
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
    
    // No longer subtracting brokerage from net amount, just recording it
    const calculatedNetAmount = calculatedTotalAmount;
    setNetAmount(calculatedNetAmount);
  }, [form.watch(), showBrokerage]);

  const handleFormSubmit = (data: FormData) => {
    const customer = customers.find(c => c.id === data.customerId);
    
    const submitData = {
      ...data,
      customer: customer ? customer.name : data.customerId,
      customerId: data.customerId,
      transporter: data.transporterId ? transporters.find(t => t.id === data.transporterId)?.name || "" : "",
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || "" : "",
      brokerageAmount: showBrokerage && data.brokerId ? brokerageAmount : 0,
      brokerageType: data.brokerageType || "percentage",
      totalAmount,
      netAmount,
      transportCost,
      billAmount: data.billNumber ? totalAmount : 0,
      id: initialData?.id || `sale-${Date.now()}`,
      amount: netAmount,
    };
    
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
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
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
              name="lotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Number</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lot number" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory.map((item) => (
                        <SelectItem key={item.id} value={item.lotNumber}>
                          {item.lotNumber} ({item.quantity} bags available) - {item.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transporter (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
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
                    <Input 
                      type="number" 
                      {...field}
                      placeholder="0.00"
                      step="0.01"
                      disabled={form.watch('transporterId') === 'self' || !form.watch('transporterId')}
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Chiplun">Chiplun</SelectItem>
                      <SelectItem value="Sawantwadi">Sawantwadi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="col-span-full">
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
                  <p className="text-sm text-gray-500">Brokerage (recorded)</p>
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
    </Card>
  );
};

export default SalesForm;
