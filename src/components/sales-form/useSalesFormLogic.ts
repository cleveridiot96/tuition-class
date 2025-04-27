
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";

// Define the schema with validation rules
const salesFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  customerId: z.string().min(1, "Customer is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  netWeight: z.number().min(0, "Net weight is required"),
  rate: z.number().min(0, "Rate is required"),
  transporterId: z.string().optional(),
  transportCost: z.union([z.number(), z.string()]).optional(),
  brokerId: z.string().optional(),
  brokerageAmount: z.union([z.number(), z.string(), z.null()]).optional(),
  billNumber: z.string().optional(),
  billAmount: z.union([z.number(), z.string(), z.null()]).optional(),
  notes: z.string().optional()
});

export const useSalesFormLogic = (initialData: any) => {
  // Setup form with default values
  const form = useForm({
    resolver: zodResolver(salesFormSchema),
    mode: "onSubmit", // Only validate on submit, not on change
    defaultValues: {
      date: initialData?.date || new Date().toISOString().split("T")[0],
      lotNumber: initialData?.lotNumber || "",
      customerId: initialData?.customerId || "",
      quantity: initialData?.quantity || 0,
      netWeight: initialData?.netWeight || 0,
      rate: initialData?.rate || 0,
      transporterId: initialData?.transporterId || "",
      transportCost: initialData?.transportCost || 0,
      brokerId: initialData?.brokerId || "",
      brokerageAmount: initialData?.brokerageAmount || 0,
      billNumber: initialData?.billNumber || "",
      billAmount: initialData?.billAmount || null,
      notes: initialData?.notes || ""
    }
  });

  // State for data and selected items
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [isCutBill, setIsCutBill] = useState<boolean>(initialData?.billAmount !== null && initialData?.billAmount !== undefined);
  
  // Load data on mount
  useEffect(() => {
    try {
      const loadedInventory = getInventory() || [];
      const loadedCustomers = getCustomers() || [];
      const loadedBrokers = getBrokers() || [];
      const loadedTransporters = getTransporters() || [];
      
      setInventory(loadedInventory);
      setCustomers(loadedCustomers);
      setBrokers(loadedBrokers);
      setTransporters(loadedTransporters);
      
      // If initialData exists, set selected items
      if (initialData) {
        if (initialData.lotNumber) {
          const lot = loadedInventory.find(i => i.lotNumber === initialData.lotNumber);
          if (lot) {
            setSelectedLot(lot);
            setMaxQuantity(initialData.quantity || lot.remainingQuantity);
          }
        }
        
        if (initialData.brokerId) {
          const broker = loadedBrokers.find(b => b.id === initialData.brokerId);
          if (broker) {
            setSelectedBroker(broker);
            form.setValue("brokerageAmount", initialData.brokerageAmount || 0);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data. Please refresh the page.");
    }
  }, []);
  
  // Handle lot change
  const handleLotChange = (lotNumber: string) => {
    form.setValue("lotNumber", lotNumber);
    
    const lot = inventory.find(item => item.lotNumber === lotNumber);
    if (lot) {
      setSelectedLot(lot);
      setMaxQuantity(lot.remainingQuantity);
      form.setValue("quantity", Math.min(form.getValues("quantity") || 0, lot.remainingQuantity));
      form.setValue("netWeight", lot.netWeightPerUnit ? (lot.netWeightPerUnit * form.getValues("quantity")) : 0);
    } else {
      setSelectedLot(null);
      setMaxQuantity(0);
      form.setValue("netWeight", 0);
    }
  };
  
  // Handle broker change
  const handleBrokerChange = (brokerId: string) => {
    form.setValue("brokerId", brokerId);
    
    const broker = brokers.find(b => b.id === brokerId);
    setSelectedBroker(broker || null);
    
    if (broker && broker.commissionRate) {
      const subtotal = (form.getValues("quantity") || 0) * (form.getValues("rate") || 0);
      const brokerageAmount = (subtotal * broker.commissionRate) / 100;
      form.setValue("brokerageAmount", brokerageAmount);
    } else {
      form.setValue("brokerageAmount", 0);
    }
  };
  
  // Handle bill amount toggle
  const handleBillAmountToggle = (enabled: boolean) => {
    setIsCutBill(enabled);
    if (!enabled) {
      form.setValue("billAmount", null);
    } else if (enabled && !form.getValues("billAmount")) {
      // If enabling cut bill and no amount is set, default to calculated total
      const subtotal = (form.getValues("quantity") || 0) * (form.getValues("rate") || 0);
      const transportCost = form.getValues("transportCost") || 0;
      const brokerageAmount = form.getValues("brokerageAmount") || 0;
      form.setValue("billAmount", subtotal + transportCost + brokerageAmount);
    }
  };

  return {
    form,
    inventory,
    customers,
    brokers,
    transporters,
    selectedLot,
    selectedBroker,
    maxQuantity,
    isCutBill,
    handleLotChange,
    handleBrokerChange,
    handleBillAmountToggle,
  };
};
