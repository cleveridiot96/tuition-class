
import React from 'react';
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
  FormMessage,
  FormRow
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { getCustomers } from "@/services/storageService";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  customerId: z.string().min(1, "Customer is required"),
  receiptMode: z.string().min(1, "Receipt mode is required"),
  billNumber: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

export interface ReceiptFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ReceiptForm = ({ onSubmit, onCancel, initialData }: ReceiptFormProps) => {
  const [customers, setCustomers] = React.useState<any[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date || format(new Date(), 'yyyy-MM-dd'),
      customerId: initialData.customerId || "",
      receiptMode: initialData.receiptMode || "cash",
    } : {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      customerId: "",
      receiptMode: "cash",
      billNumber: "",
      reference: "",
      notes: ""
    }
  });
  
  React.useEffect(() => {
    // Load customers
    const loadedCustomers = getCustomers();
    setCustomers(loadedCustomers);
  }, []);

  const handleFormSubmit = (data: FormData) => {
    try {
      // Get customer name for record
      const selectedCustomer = customers.find(c => c.id === data.customerId);
      
      if (!selectedCustomer) {
        toast.error("Please select a valid customer");
        return;
      }
      
      // Format data for submission
      const submitData = {
        ...data,
        customerName: selectedCustomer?.name || "",
        id: initialData?.id || Date.now().toString(),
        receiptNumber: initialData?.receiptNumber || `R-${Date.now().toString().slice(-6)}`,
        paymentMethod: data.receiptMode // For compatibility with existing code
      };
      
      // Submit the data
      onSubmit(submitData);
      toast.success(initialData ? "Receipt updated successfully" : "Receipt added successfully");
    } catch (error) {
      console.error("Error submitting receipt:", error);
      toast.error("Failed to save receipt. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="bg-blue-100 p-4 mb-4 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Receipt Information</h3>
            <p className="text-sm text-blue-700">
              Enter receipt details from customer.
            </p>
          </div>
          
          <FormRow columns={2}>
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
          
          <FormRow columns={2}>
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
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-customers">No customers found</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="receiptMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select receipt mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
          
          <FormRow columns={2}>
            <FormField
              control={form.control}
              name="billNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Bill Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter bill number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Reference</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter reference" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Notes</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} placeholder="Enter any additional notes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Receipt" : "Add Receipt"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ReceiptForm;
