
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { saveTransferHistory } from "@/services/transferService";
import DashboardCard from "@/components/dashboard/DashboardCard";
import TransferHistory from "./TransferHistory";

// Define form schema with validation
const transferFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  fromLocation: z.string().min(1, "Source location is required"),
  toLocation: z.string().min(1, "Destination location is required"),
  bags: z.coerce.number().int().positive("Number of bags must be positive"),
  weight: z.coerce.number().positive("Weight must be positive"),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

const TransferForm = () => {
  const [showHistory, setShowHistory] = useState(false);
  const locations = ["Mumbai", "Chiplun", "Sawantwadi"];
  
  // Initialize the form
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      lotNumber: "",
      fromLocation: "",
      toLocation: "",
      bags: 0,
      weight: 0,
      notes: "",
    },
  });
  
  const onSubmit = (data: TransferFormValues) => {
    // Validate that from and to locations are different
    if (data.fromLocation === data.toLocation) {
      toast.error("Source and destination locations cannot be the same");
      return;
    }
    
    // Create transfer record
    const transferRecord = {
      id: `transfer-${Date.now()}`,
      date: data.date,
      lotNumber: data.lotNumber,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      bags: data.bags,
      weight: data.weight,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    
    // Save the transfer
    saveTransferHistory(transferRecord);
    
    // Show success message
    toast.success("Transfer recorded successfully");
    
    // Reset the form
    form.reset({
      date: new Date().toISOString().split('T')[0],
      lotNumber: "",
      fromLocation: "",
      toLocation: "",
      bags: 0,
      weight: 0,
      notes: "",
    });
  };
  
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-purple-800">Transfer Stock Between Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fromLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
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
                  name="toLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Bags</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter number of bags" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="Enter weight in kg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Additional notes (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? "Hide History" : "View Transfer History"}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Submit Transfer
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {showHistory && (
        <DashboardCard title="Transfer History" className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <TransferHistory />
        </DashboardCard>
      )}
    </div>
  );
};

export default TransferForm;
