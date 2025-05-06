
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormRow,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSuppliers, getBrokers, getNextPaymentNumber } from "@/services/storageService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  paymentNumber: z.string().min(1, "Payment number is required"),
  entityId: z.string().min(1, "Please select an entity"),
  entityType: z.enum(["supplier", "broker"]),
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMethod: z.enum(["cash", "bank"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const PaymentForm = ({ onSubmit, onCancel, initialData }: PaymentFormProps) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("supplier");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
      paymentNumber: initialData?.paymentNumber || getNextPaymentNumber(),
      entityId: initialData?.supplierId || initialData?.brokerId || "",
      entityType: initialData?.supplierId ? "supplier" : "broker",
      amount: initialData?.amount || 0,
      paymentMethod: initialData?.paymentMethod || "cash",
      reference: initialData?.reference || "",
      notes: initialData?.notes || "",
    },
  });

  const entityType = form.watch("entityType");

  useEffect(() => {
    // Set active tab based on form value
    setActiveTab(entityType);
  }, [entityType]);

  useEffect(() => {
    // Load suppliers and brokers
    setSuppliers(getSuppliers() || []);
    setBrokers(getBrokers() || []);
    
    // If initial data has supplierId or brokerId, set the appropriate tab
    if (initialData) {
      if (initialData.supplierId) {
        form.setValue("entityType", "supplier");
        form.setValue("entityId", initialData.supplierId);
        setActiveTab("supplier");
      } else if (initialData.brokerId) {
        form.setValue("entityType", "broker");
        form.setValue("entityId", initialData.brokerId);
        setActiveTab("broker");
      }
    }
  }, [initialData]);

  const handleSubmit = (data: FormValues) => {
    try {
      const { entityId, entityType, ...rest } = data;
      
      // Prepare data based on entity type
      const entityData = entityType === "supplier" 
        ? { 
            supplierId: entityId, 
            supplierName: suppliers.find(s => s.id === entityId)?.name || "Unknown Supplier" 
          }
        : { 
            brokerId: entityId, 
            brokerName: brokers.find(b => b.id === entityId)?.name || "Unknown Broker" 
          };
      
      // Combine data for submission
      const submitData = {
        ...rest,
        ...entityData,
        id: initialData?.id || uuidv4(),
        amount: Number(data.amount),
      };
      
      onSubmit(submitData);
      toast.success(initialData ? "Payment updated successfully" : "Payment added successfully");
    } catch (error) {
      console.error("Error in payment form:", error);
      toast.error("Error submitting the form. Please check your inputs.");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("entityType", value as "supplier" | "broker");
    form.setValue("entityId", ""); // Reset entity ID when switching tabs
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="p-4 bg-white rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                name="paymentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>

            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="supplier">Supplier</TabsTrigger>
                <TabsTrigger value="broker">Broker</TabsTrigger>
              </TabsList>

              <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />

              <TabsContent value="supplier" className="mt-0">
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={entityType === "supplier" ? field.value : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="broker" className="mt-0">
                <FormField
                  control={form.control}
                  name="entityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Broker</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={entityType === "broker" ? field.value : ""}
                      >
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
              </TabsContent>
            </Tabs>

            <FormRow columns={2}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>

            <FormRow columns={1}>
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Reference</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>

            <FormRow columns={1}>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel optional>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormRow>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Save"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default PaymentForm;
