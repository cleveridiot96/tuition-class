
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";

// Define the schema for sales form validation
const SalesFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  customerId: z.string().min(1, "Customer is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  netWeight: z.number().min(1, "Net weight must be greater than 0"),
  rate: z.number().min(1, "Rate must be greater than 0"),
  transporterId: z.string().optional(),
  transportCost: z.number().default(0),
  brokerId: z.string().optional(),
  brokerageAmount: z.number().default(0),
  billNumber: z.string().optional(),
  billAmount: z.number().nullable(),
  notes: z.string().optional()
});

export type SalesFormValues = z.infer<typeof SalesFormSchema>;

export const useSalesFormLogic = (initialData: any) => {
  // State for data
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [isCutBill, setIsCutBill] = useState<boolean>(initialData?.billAmount !== undefined && initialData?.billAmount !== null);
  const [customerBalance, setCustomerBalance] = useState<number>(0);

  // Form setup
  const form = useForm<SalesFormValues>({
    resolver: zodResolver(SalesFormSchema),
    mode: "onSubmit", // Changed from onChange to onSubmit
    reValidateMode: "onSubmit", // Added to prevent revalidation on change
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

  // Load data
  useEffect(() => {
    const loadData = () => {
      // Fetch inventory
      const inventoryItems = getInventory() || [];
      const availableItems = inventoryItems.filter(
        (item) => !item.isDeleted && item.remainingQuantity > 0
      );
      setInventory(availableItems);

      // Fetch customers
      const customerData = getCustomers() || [];
      setCustomers(customerData);

      // Fetch brokers
      const brokerData = getBrokers() || [];
      setBrokers(brokerData);

      // Fetch transporters
      const transporterData = getTransporters() || [];
      setTransporters(transporterData);

      // Set selected lot and broker if initialData is provided
      if (initialData?.lotNumber) {
        const lot = inventoryItems.find((item) => item.lotNumber === initialData.lotNumber);
        if (lot) {
          setSelectedLot(lot);
          setMaxQuantity(lot.remainingQuantity + (initialData.quantity || 0));
        }
      }

      if (initialData?.brokerId) {
        const broker = brokerData.find((b) => b.id === initialData.brokerId);
        if (broker) {
          setSelectedBroker(broker);
        }
      }

      // Set customer balance if customer is selected
      if (initialData?.customerId) {
        const customer = customerData.find((c) => c.id === initialData.customerId);
        if (customer) {
          setCustomerBalance(customer.balance || 0);
        }
      }
    };

    loadData();
  }, [initialData]);

  // Handle lot change
  const handleLotChange = (lotNumber: string) => {
    const lot = inventory.find((item) => item.lotNumber === lotNumber);
    if (lot) {
      setSelectedLot(lot);
      setMaxQuantity(lot.remainingQuantity + (initialData?.quantity || 0));
      
      // Update the form with lot details
      form.setValue("lotNumber", lotNumber);
      form.setValue("rate", lot.rate || 0);
      
      // If this is a new sale (not edit), set default quantity
      if (!initialData) {
        const defaultQty = Math.min(1, lot.remainingQuantity);
        form.setValue("quantity", defaultQty);
        
        // Update netWeight based on quantity
        if (lot.netWeight && lot.quantity) {
          const weightPerUnit = lot.netWeight / lot.quantity;
          form.setValue("netWeight", defaultQty * weightPerUnit);
        }
      }
    }
  };

  // Handle broker change
  const handleBrokerChange = (brokerId: string) => {
    const broker = brokers.find((b) => b.id === brokerId);
    setSelectedBroker(broker || null);
    
    // Update brokerage amount
    if (broker?.commissionRate) {
      const quantity = form.getValues("quantity") || 0;
      const rate = form.getValues("rate") || 0;
      const brokerageAmount = (quantity * rate * broker.commissionRate) / 100;
      form.setValue("brokerageAmount", brokerageAmount);
    } else {
      form.setValue("brokerageAmount", 0);
    }
  };

  // Watch for customer change to update balance
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "customerId") {
        const customerId = value.customerId;
        const customer = customers.find((c) => c.id === customerId);
        if (customer) {
          setCustomerBalance(customer.balance || 0);
        } else {
          setCustomerBalance(0);
        }
      }
      
      // Recalculate brokerage when quantity or rate changes
      if ((name === "quantity" || name === "rate") && selectedBroker?.commissionRate) {
        const quantity = value.quantity || 0;
        const rate = value.rate || 0;
        const brokerageAmount = (quantity * rate * selectedBroker.commissionRate) / 100;
        form.setValue("brokerageAmount", brokerageAmount);
      }

      // Update netWeight when quantity changes
      if (name === "quantity" && selectedLot) {
        const quantity = value.quantity || 0;
        if (selectedLot.netWeight && selectedLot.quantity) {
          const weightPerUnit = selectedLot.netWeight / selectedLot.quantity;
          form.setValue("netWeight", quantity * weightPerUnit);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, customers, selectedBroker, selectedLot]);

  // Toggle bill amount editing
  const handleBillAmountToggle = (enabled: boolean) => {
    setIsCutBill(enabled);
    if (!enabled) {
      // When disabling cut bill, reset bill amount to match calculated amount
      const quantity = form.getValues("quantity") || 0;
      const rate = form.getValues("rate") || 0;
      const transportCost = form.getValues("transportCost") || 0;
      const brokerageAmount = form.getValues("brokerageAmount") || 0;
      const totalAmount = quantity * rate + transportCost + brokerageAmount;
      form.setValue("billAmount", totalAmount);
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
    customerBalance,
    handleLotChange,
    handleBrokerChange,
    handleBillAmountToggle,
  };
};
