import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";

const salesSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  billNumber: z.string().optional(),
  lotNumber: z.string().min(1, { message: "Lot Number is required" }),
  customerId: z.string().optional(), // Not required if broker is specified
  billAmount: z.number().optional().nullable(),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  netWeight: z.number().min(0, { message: "Net Weight must be greater than or equal to 0" }),
  rate: z.number().min(0, { message: "Rate must be greater than or equal to 0" }),
  transporterId: z.string().optional(),
  transportCost: z.number().optional().default(0),
  brokerId: z.string().optional(), // Not required if customerId is specified
  brokerageAmount: z.number().optional().default(0),
  notes: z.string().optional(),
});

type SalesFormValues = z.infer<typeof salesSchema>;

interface ContinuousSalesFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialSale?: any;
}

const ContinuousSalesForm: React.FC<ContinuousSalesFormProps> = ({
  onSubmit,
  onCancel,
  initialSale,
}) => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [isCutBill, setIsCutBill] = useState<boolean>(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);

  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      date: initialSale?.date || new Date().toISOString().split("T")[0],
      billNumber: initialSale?.billNumber || "",
      lotNumber: initialSale?.lotNumber || "",
      customerId: initialSale?.customerId || "",
      quantity: initialSale?.quantity || 0,
      netWeight: initialSale?.netWeight || 0,
      rate: initialSale?.rate || 0,
      transporterId: initialSale?.transporterId || "",
      transportCost: initialSale?.transportCost || 0,
      brokerId: initialSale?.brokerId || "",
      brokerageAmount: initialSale?.brokerageAmount || 0,
      billAmount: initialSale?.billAmount || null,
      notes: initialSale?.notes || "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      const invData = getInventory() || [];
      setInventory(invData.filter((item) => !item.isDeleted && item.remainingQuantity > 0));
      setCustomers(getCustomers() || []);
      setBrokers(getBrokers() || []);
      setTransporters(getTransporters() || []);
    };

    loadData();
    
    if (initialSale?.billAmount !== null && initialSale?.billAmount !== undefined) {
      setIsCutBill(true);
    }
  }, [initialSale]);

  const handleLotChange = (lotNumber: string) => {
    const selected = inventory.find((item) => item.lotNumber === lotNumber);
    if (selected) {
      setSelectedLot(selected);
      setMaxQuantity(selected.remainingQuantity);
      
      const quantity = Math.min(form.getValues("quantity") || 0, selected.remainingQuantity);
      form.setValue("quantity", quantity);
      
      if (quantity > 0) {
        const weightPerUnit = selected.netWeight / selected.quantity;
        form.setValue("netWeight", quantity * weightPerUnit);
      }
    } else {
      setSelectedLot(null);
      setMaxQuantity(0);
    }
  };

  const handleBrokerChange = (brokerId: string) => {
    const selectedBroker = brokers.find((b) => b.id === brokerId);
    setSelectedBroker(selectedBroker);

    if (selectedBroker) {
      const commissionRate = selectedBroker.commissionRate || 0;
      const subtotal = form.getValues("quantity") * form.getValues("rate");
      const brokerageAmount = (subtotal * commissionRate) / 100;
      form.setValue("brokerageAmount", brokerageAmount);
    } else {
      form.setValue("brokerageAmount", 0);
    }
  };

  useEffect(() => {
    const subscription = form.watch(({ quantity, rate }) => {
      if (selectedBroker && quantity && rate) {
        const commissionRate = selectedBroker.commissionRate || 0;
        const subtotal = quantity * rate;
        const brokerageAmount = (subtotal * commissionRate) / 100;
        form.setValue("brokerageAmount", brokerageAmount);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedBroker]);

  useEffect(() => {
    const subscription = form.watch(({ quantity }) => {
      if (quantity && quantity > 0) {
        const currentNetWeight = form.getValues("netWeight");
        if (!currentNetWeight || currentNetWeight === 0) {
          form.setValue("netWeight", quantity * 50);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = (data: SalesFormValues) => {
    if (!data.customerId && !data.brokerId) {
      form.setError("customerId", {
        type: "manual",
        message: "Either Customer or Broker must be specified"
      });
      form.setError("brokerId", {
        type: "manual",
        message: "Either Customer or Broker must be specified"
      });
      return;
    }

    const subtotal = data.quantity * data.rate;
    const totalAmount = subtotal + (data.transportCost || 0) + (data.brokerageAmount || 0);
    const billAmount = data.billAmount !== null ? data.billAmount : totalAmount;
    
    const salesData = {
      ...data,
      id: initialSale?.id || `sale-${Date.now()}`,
      totalAmount,
      billAmount,
      customer: customers.find((c) => c.id === data.customerId)?.name || "",
      broker: brokers.find((b) => b.id === data.brokerId)?.name || "",
      transporter: transporters.find((t) => t.id === data.transporterId)?.name || ""
    };

    onSubmit(salesData);
  };

  const handleBillAmountToggle = (enableCustomAmount: boolean) => {
    setIsCutBill(enableCustomAmount);
    if (!enableCustomAmount) {
      form.setValue("billAmount", null);
    } else {
      const subtotal = form.getValues("quantity") * form.getValues("rate");
      const transportCost = form.getValues("transportCost") || 0;
      const brokerageAmount = form.getValues("brokerageAmount") || 0;
      form.setValue("billAmount", subtotal + transportCost + brokerageAmount);
    }
  };

  const calculateSubtotal = () => {
    const quantity = form.getValues("quantity") || 0;
    const rate = form.getValues("rate") || 0;
    return quantity * rate;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const transportCost = form.getValues("transportCost") || 0;
    const brokerageAmount = form.getValues("brokerageAmount") || 0;
    return subtotal + transportCost + brokerageAmount;
  };

  const handleAddNewToMaster = (value: string): string => {
    if (!value.trim()) return "";
    
    if (value) {
      console.log(`Adding new item with value: ${value}`);
      return value.trim();
    }
    
    return "";
  };

  const inventoryOptions = inventory.map(item => ({
    value: item.lotNumber,
    label: `${item.lotNumber} (${item.remainingQuantity} bags)`
  }));
  
  const customerOptions = customers.map(customer => ({
    value: customer.id,
    label: customer.name
  }));
  
  const brokerOptions = [
    { value: "", label: "None" },
    ...brokers.map(broker => ({
      value: broker.id,
      label: `${broker.name} (${broker.commissionRate || 0}%)`
    }))
  ];
  
  const transporterOptions = [
    { value: "", label: "None" },
    ...transporters.map(transporter => ({
      value: transporter.id,
      label: transporter.name
    }))
  ];

  return (
    <Card className="bg-white border-green-100 shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            {initialSale ? "Edit Sale" : "Add New Sale"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">Fill in the sale details</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <FormLabel optional>Bill Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <div className="flex items-center justify-between">
                        <FormLabel optional>Bill Amount</FormLabel>
                        <label className="text-xs flex items-center">
                          <input
                            type="checkbox"
                            checked={isCutBill}
                            onChange={(e) => handleBillAmountToggle(e.target.checked)}
                            className="mr-1"
                          />
                          Cut Bill
                        </label>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={!isCutBill}
                          value={field.value ?? ""}
                          className={isCutBill ? "bg-yellow-50 border-yellow-300" : ""}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : null;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lotNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot Number</FormLabel>
                      <FormControl>
                        <EnhancedSearchableSelect
                          options={inventoryOptions}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleLotChange(value);
                          }}
                          placeholder="Select lot"
                          className="w-full"
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
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <EnhancedSearchableSelect
                          options={customerOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select customer"
                          className="w-full"
                          onAddNew={handleAddNewToMaster}
                          masterType="customer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quantity (Bags){" "}
                        {maxQuantity > 0 && (
                          <span className="text-xs text-gray-500">Max: {maxQuantity}</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          max={maxQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10) || 0;
                            const limitedValue = Math.min(value, maxQuantity || 0);
                            field.onChange(limitedValue);
                          }}
                          value={field.value || ''}
                        />
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
                        <Input 
                          type="number" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                          }}
                        />
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
                      <FormLabel>Rate (₹/kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="transporterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel optional>Transporter</FormLabel>
                      <FormControl>
                        <EnhancedSearchableSelect
                          options={transporterOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select transporter"
                          className="w-full"
                          masterType="transporter"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transportCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel optional>Transport Cost (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brokerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Broker</FormLabel>
                      <FormControl>
                        <EnhancedSearchableSelect
                          options={brokerOptions}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleBrokerChange(value);
                          }}
                          placeholder="Select broker"
                          className="w-full"
                          masterType="broker"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="brokerageAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brokerage Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          value={field.value || ''}
                          readOnly={!!selectedBroker}
                          className={selectedBroker ? "bg-gray-50" : ""}
                        />
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
                    <FormLabel optional>Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between bg-white p-6 rounded-lg border">
              <div className="md:w-2/3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Cost:</span>
                    <span>₹{(form.watch("transportCost") || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brokerage Amount:</span>
                    <span>₹{(form.watch("brokerageAmount") || 0).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  {isCutBill && (
                    <div className="text-yellow-600 flex justify-between">
                      <span>Bill Amount (Cut):</span>
                      <span>₹{(form.watch("billAmount") || 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {initialSale ? "Update Sale" : "Add Sale"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContinuousSalesForm;
