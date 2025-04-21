
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";
import { PrinterIcon } from "lucide-react";

// Define form schema
const salesFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  customerId: z.string().min(1, "Customer is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  netWeight: z.coerce.number().min(1, "Net weight is required"),
  rate: z.coerce.number().min(1, "Rate is required"),
  transporterId: z.string().optional(),
  transportCost: z.coerce.number().default(0),
  brokerId: z.string().optional(),
  brokerageAmount: z.coerce.number().default(0),
  notes: z.string().optional(),
  billNumber: z.string().optional(),
  billAmount: z.coerce.number().nullable().optional(),
});

type SalesFormData = z.infer<typeof salesFormSchema>;

interface SalesFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onPrint?: () => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ onSubmit, initialData, onPrint }) => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [isCutBill, setIsCutBill] = useState<boolean>(false);

  const form = useForm<SalesFormData>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
      lotNumber: initialData?.lotNumber || "",
      customerId: initialData?.customerId || "",
      quantity: initialData?.quantity || 0,
      netWeight: initialData?.netWeight || 0,
      rate: initialData?.rate || 0,
      transporterId: initialData?.transporterId || "",
      transportCost: initialData?.transportCost || 0,
      brokerId: initialData?.brokerId || "",
      brokerageAmount: initialData?.brokerageAmount || 0,
      notes: initialData?.notes || "",
      billNumber: initialData?.billNumber || "",
      billAmount: initialData?.billAmount || null,
    },
  });

  // Load data on component mount
  useEffect(() => {
    const loadInventory = () => {
      const inventoryData = getInventory() || [];
      // Only show items with remaining quantity
      const availableItems = inventoryData.filter(
        (item) => !item.isDeleted && item.remainingQuantity > 0
      );
      setInventory(availableItems);
    };

    const loadCustomers = () => {
      const customersData = getCustomers() || [];
      setCustomers(customersData);
    };

    const loadBrokers = () => {
      const brokersData = getBrokers() || [];
      setBrokers(brokersData);
    };

    const loadTransporters = () => {
      const transportersData = getTransporters() || [];
      setTransporters(transportersData);
    };

    loadInventory();
    loadCustomers();
    loadBrokers();
    loadTransporters();

    // If editing existing sale, set the selected lot
    if (initialData?.lotNumber) {
      const lot = getInventory()?.find(
        (item) => item.lotNumber === initialData.lotNumber
      );
      if (lot) {
        setSelectedLot(lot);
        setMaxQuantity(
          lot.remainingQuantity + (initialData.quantity || 0)
        );
      }
    }

    // If broker is selected, get broker details
    if (initialData?.brokerId) {
      const broker = getBrokers()?.find(
        (b) => b.id === initialData.brokerId
      );
      if (broker) {
        setSelectedBroker(broker);
      }
    }
    
    // Check if this is a cut bill
    if (initialData?.billAmount) {
      setIsCutBill(true);
    }
  }, [initialData]);

  // Reset form when lot changes
  useEffect(() => {
    if (!selectedLot) return;
    
    form.setValue("netWeight", form.getValues("quantity") * (selectedLot.netWeight / selectedLot.quantity));
    
    // Only set the rate if it's a new form or the rate is 0
    if (!initialData || form.getValues("rate") === 0) {
      form.setValue("rate", selectedLot.rate || 0);
    }
  }, [selectedLot, form.watch("quantity")]);

  // Calculate total amount when relevant fields change
  useEffect(() => {
    const quantity = form.watch("quantity");
    const rate = form.watch("rate");
    const transportCost = form.watch("transportCost");
    const brokerageAmount = form.watch("brokerageAmount");
    
    const totalAmount = (quantity * rate) + transportCost + brokerageAmount;
    
    // If this is not a cut bill, update the bill amount to match the calculated total
    if (!isCutBill && form.getValues("billAmount") !== totalAmount) {
      form.setValue("billAmount", totalAmount);
    }
  }, [
    form.watch("quantity"),
    form.watch("rate"),
    form.watch("transportCost"),
    form.watch("brokerageAmount"),
    isCutBill
  ]);
  
  // Calculate brokerage amount when broker changes
  useEffect(() => {
    if (selectedBroker) {
      const subtotal = form.getValues("quantity") * form.getValues("rate");
      const brokerageAmount = (subtotal * selectedBroker.commissionRate) / 100;
      form.setValue("brokerageAmount", brokerageAmount);
    } else {
      form.setValue("brokerageAmount", 0);
    }
  }, [selectedBroker, form.watch("quantity"), form.watch("rate")]);

  const handleLotChange = (lotNumber: string) => {
    const lot = inventory.find((item) => item.lotNumber === lotNumber);
    if (lot) {
      setSelectedLot(lot);
      setMaxQuantity(lot.remainingQuantity);
      form.setValue("lotNumber", lotNumber);
      
      // Reset quantity to 1 or max available
      const newQuantity = Math.min(1, lot.remainingQuantity);
      form.setValue("quantity", newQuantity);
      
      // Calculate net weight based on the lot's weight-to-quantity ratio
      const weightPerUnit = lot.netWeight / lot.quantity;
      form.setValue("netWeight", newQuantity * weightPerUnit);
    }
  };

  const handleBrokerChange = (brokerId: string) => {
    form.setValue("brokerId", brokerId);
    
    if (brokerId) {
      const broker = brokers.find((b) => b.id === brokerId);
      setSelectedBroker(broker);
    } else {
      setSelectedBroker(null);
      form.setValue("brokerageAmount", 0);
    }
  };

  const handleBillAmountToggle = (enableCustomAmount: boolean) => {
    setIsCutBill(enableCustomAmount);
    
    if (!enableCustomAmount) {
      // If disabling custom bill amount, calculate the total and set it
      const quantity = form.getValues("quantity");
      const rate = form.getValues("rate");
      const transportCost = form.getValues("transportCost");
      const brokerageAmount = form.getValues("brokerageAmount");
      
      const calculatedTotal = (quantity * rate) + transportCost + brokerageAmount;
      form.setValue("billAmount", calculatedTotal);
    }
  };

  const handleFormSubmit = (formData: SalesFormData) => {
    // Calculate total amount
    const subtotal = formData.quantity * formData.rate;
    const totalAmount = subtotal + formData.transportCost + formData.brokerageAmount;
    
    // If bill amount is not set, use the calculated total
    const billAmount = formData.billAmount !== null ? formData.billAmount : totalAmount;
    
    const salesData = {
      ...formData,
      id: initialData?.id || `sale-${Date.now()}`,
      totalAmount,
      billAmount,
      customer: customers.find((c) => c.id === formData.customerId)?.name,
      broker: brokers.find((b) => b.id === formData.brokerId)?.name,
      transporter: transporters.find((t) => t.id === formData.transporterId)?.name
    };

    onSubmit(salesData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                <FormLabel>Bill Number</FormLabel>
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
                  <FormLabel>Bill Amount</FormLabel>
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
                <Select
                  onValueChange={handleLotChange}
                  value={field.value}
                  disabled={!!initialData}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lot number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={item.lotNumber}>
                        {item.lotNumber} ({item.remainingQuantity} bags)
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
                      
                      if (selectedLot) {
                        const weightPerUnit = selectedLot.netWeight / selectedLot.quantity;
                        form.setValue("netWeight", limitedValue * weightPerUnit);
                      }
                    }}
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
                  <Input type="number" {...field} readOnly />
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
                <FormLabel>Rate (per kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="transporterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transporter</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transporter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
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
            name="transportCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Broker</FormLabel>
                <Select
                  onValueChange={handleBrokerChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select broker" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {brokers.map((broker) => (
                      <SelectItem key={broker.id} value={broker.id}>
                        {broker.name} ({broker.commissionRate}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="brokerageAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brokerage Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  readOnly={!!selectedBroker}
                />
              </FormControl>
              {selectedBroker && (
                <div className="text-xs text-gray-500">
                  Auto-calculated at {selectedBroker.commissionRate}%
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <div>
            {/* Summary */}
            <div className="space-y-1 bg-gray-50 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Subtotal:</span> ₹
                {(
                  form.watch("quantity") * form.watch("rate")
                ).toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Transport:</span> ₹
                {form.watch("transportCost").toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Brokerage:</span> ₹
                {form.watch("brokerageAmount").toLocaleString()}
              </p>
              <p className="text-sm font-semibold">
                <span>Total:</span> ₹
                {(
                  form.watch("quantity") * form.watch("rate") +
                  form.watch("transportCost") +
                  form.watch("brokerageAmount")
                ).toLocaleString()}
              </p>
              {isCutBill && form.watch("billAmount") !== null && (
                <p className="text-sm font-bold text-yellow-700">
                  <span>Bill Amount:</span> ₹
                  {form.watch("billAmount").toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {initialData && onPrint && (
              <Button
                type="button"
                variant="outline"
                onClick={onPrint}
              >
                <PrinterIcon size={16} className="mr-2" />
                Print
              </Button>
            )}
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {initialData ? "Update Sale" : "Add Sale"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SalesForm;
