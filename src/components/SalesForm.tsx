
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
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
  getInventory,
  getCustomers,
  getBrokers,
  getTransporters
} from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  billNumber: z.string().optional(),
  billAmount: z.coerce.number().optional(),
  customerId: z.string().min(1, "Customer is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  brokerId: z.string().optional(),
  transporterId: z.string().min(1, "Transporter is required"),
  transportRate: z.coerce.number().min(0, "Transport rate is required"),
  location: z.string().min(1, "Location is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SalesFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const SalesForm = ({ onSubmit, initialData }: SalesFormProps) => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      customerId: initialData.customer?.id || initialData.customerId || "",
      brokerId: initialData.broker?.id || initialData.brokerId || "",
      transporterId: initialData.transporter?.id || initialData.transporterId || "",
      transportRate: initialData.transportRate || 0,
      billAmount: initialData.billAmount || 0,
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      lotNumber: "",
      billNumber: "",
      billAmount: undefined,
      customerId: "",
      quantity: 0,
      netWeight: 0,
      rate: 0,
      brokerId: "",
      transporterId: "",
      transportRate: 0,
      location: "",
      notes: "",
    }
  });

  // Load data
  useEffect(() => {
    // Immediately update inventory when the component loads
    refreshData();
    
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    const currentInventory = getInventory().filter(item => item.quantity > 0);
    console.log("Available inventory:", currentInventory);
    setInventory(currentInventory);
    setCustomers(getCustomers());
    setBrokers(getBrokers());
    setTransporters(getTransporters());
    setIsRefreshing(false);
  };

  // Auto-populate fields when lot number changes
  const handleLotChange = (lotNumber: string) => {
    const selectedLot = inventory.find(item => item.lotNumber === lotNumber);
    if (selectedLot) {
      form.setValue("location", selectedLot.location);
      form.setValue("quantity", selectedLot.quantity);
      form.setValue("netWeight", selectedLot.netWeight);
    }
  };

  // Handle calculation when values change
  useEffect(() => {
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
    const transportRate = values.transportRate || 0;
    
    // Calculate transport cost based on weight and rate
    const calculatedTransportCost = netWeight * transportRate;
    setTransportCost(calculatedTransportCost);
    
    // Calculate total and net amount
    const calculatedTotalAmount = netWeight * rate;
    setTotalAmount(calculatedTotalAmount);
    
    setNetAmount(calculatedTotalAmount - calculatedTransportCost);
  }, [form.watch()]);

  const handleFormSubmit = (data: FormData) => {
    // Format data for submission
    const submitData = {
      ...data,
      customer: customers.find(c => c.id === data.customerId)?.name || data.customerId,
      broker: data.brokerId ? brokers.find(b => b.id === data.brokerId)?.name || data.brokerId : "",
      transporter: transporters.find(t => t.id === data.transporterId)?.name || data.transporterId,
      totalAmount,
      transportCost,
      netAmount,
      billAmount: data.billAmount || 0,
      // Ensure amount field is set - this is crucial for the dashboard summary
      amount: totalAmount,
      id: initialData?.id || Date.now().toString()
    };
    
    console.log("Submitting sale data:", submitData);
    
    // Submit the data
    onSubmit(submitData);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sale Details</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          Refresh Data
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><span className="text-red-500">*</span> Date</FormLabel>
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
                  <FormLabel><span className="text-red-500">*</span> Lot Number</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleLotChange(value);
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory.length === 0 ? (
                        <SelectItem value="no-lots">No lots available</SelectItem>
                      ) : (
                        inventory.map((item) => (
                          <SelectItem key={item.id} value={item.lotNumber}>
                            {item.lotNumber} - {item.quantity} bags
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
                    <Input {...field} placeholder="Enter bill number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Amount (₹) (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      placeholder="0.00" 
                      step="0.01" 
                    />
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
                  <FormLabel><span className="text-red-500">*</span> Customer</FormLabel>
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><span className="text-red-500">*</span> Quantity (Bags)</FormLabel>
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
                  <FormLabel><span className="text-red-500">*</span> Net Weight (kg)</FormLabel>
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
                  <FormLabel><span className="text-red-500">*</span> Rate per kg (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select broker (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Broker</SelectItem>
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
              name="transporterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><span className="text-red-500">*</span> Transporter</FormLabel>
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
                  <FormLabel><span className="text-red-500">*</span> Transport Rate per kg (₹)</FormLabel>
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
                  <FormLabel><span className="text-red-500">*</span> Location</FormLabel>
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
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold">₹{totalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transport Cost</p>
                <p className="font-bold">₹{transportCost.toFixed(2)}</p>
              </div>
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
          
          <div className="flex justify-end">
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
