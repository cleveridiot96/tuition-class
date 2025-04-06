
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
  addCustomer,
  checkDuplicateLot
} from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  agentId: z.string().min(1, "Agent is required"),
  party: z.string().min(1, "Party is required"),
  location: z.string().min(1, "Location is required"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().min(1, "Transporter is required"),
  transportRate: z.coerce.number().min(0, "Transport rate must be valid"),
  expenses: z.coerce.number().min(0, "Expenses must be valid"),
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
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      agentId: initialData.agent?.id || initialData.agent || "",
      transporterId: initialData.transporter?.id || initialData.transporter || "",
      transportRate: initialData.transportRate || 0,
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
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
      notes: "",
    }
  });

  // Load data
  useEffect(() => {
    setAgents(getAgents());
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
  }, []);

  // Handle calculation when values change
  useEffect(() => {
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
    const expenses = values.expenses || 0;
    const transportRate = values.transportRate || 0;
    
    // Calculate transport cost based on weight and rate
    const calculatedTransportCost = netWeight * transportRate;
    setTransportCost(calculatedTransportCost);
    
    // Calculate total
    const calculatedTotalAmount = netWeight * rate;
    setTotalAmount(calculatedTotalAmount);
    
    // Calculate total after expenses
    const calculatedTotalAfterExpenses = calculatedTotalAmount + expenses + calculatedTransportCost;
    setTotalAfterExpenses(calculatedTotalAfterExpenses);
    
    // Calculate rate per kg after expenses
    const calculatedRatePerKg = netWeight > 0 ? calculatedTotalAfterExpenses / netWeight : 0;
    setRatePerKgAfterExpenses(calculatedRatePerKg);
  }, [form.watch()]);

  const handleFormSubmit = (data: FormData) => {
    // Check for duplicate lot number
    const duplicateLot = checkDuplicateLot(
      data.lotNumber,
      initialData ? initialData.id : undefined
    );

    if (duplicateLot && !initialData) {
      form.setError("lotNumber", {
        type: "manual",
        message: "This lot number already exists"
      });
      return;
    }
    
    // Format data for submission
    const submitData = {
      ...data,
      agent: agents.find(a => a.id === data.agentId)?.name || data.agentId,
      transporter: transporters.find(t => t.id === data.transporterId)?.name || data.transporterId,
      totalAmount,
      transportCost,
      expenses: data.expenses,
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    // Add supplier as customer if they don't exist yet
    if (data.party && !suppliers.some(s => s.name === data.party)) {
      const newCustomer = {
        id: Date.now().toString(),
        name: data.party,
        contactNumber: "",
        address: "",
        balance: 0
      };
      addCustomer(newCustomer);
    }
    
    // Submit the data
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
                  <FormLabel>Agent</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
