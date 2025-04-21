
import React, { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";
import SalesFormFields from "./sales-form/SalesFormFields";
import SalesFormSummary from "./sales-form/SalesFormSummary";
import SalesFormActions from "./sales-form/SalesFormActions";

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

  useEffect(() => {
    const loadInventory = () => {
      const inventoryData = getInventory() || [];
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

    if (initialData?.lotNumber) {
      const lot = getInventory()?.find(
        (item) => item.lotNumber === initialData.lotNumber
      );
      if (lot) {
        setSelectedLot(lot);
        setMaxQuantity(lot.remainingQuantity + (initialData.quantity || 0));
      }
    }

    if (initialData?.brokerId) {
      const broker = getBrokers()?.find(
        (b) => b.id === initialData.brokerId
      );
      if (broker) {
        setSelectedBroker(broker);
      }
    }
    if (initialData?.billAmount) {
      setIsCutBill(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (!selectedLot) return;
    form.setValue("netWeight", form.getValues("quantity") * (selectedLot.netWeight / selectedLot.quantity));
    if (!initialData || form.getValues("rate") === 0) {
      form.setValue("rate", selectedLot.rate || 0);
    }
  }, [selectedLot, form.watch("quantity")]);

  useEffect(() => {
    const quantity = form.watch("quantity");
    const rate = form.watch("rate");
    const transportCost = form.watch("transportCost");
    const brokerageAmount = form.watch("brokerageAmount");
    const totalAmount = (quantity * rate) + transportCost + brokerageAmount;
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
      const newQuantity = Math.min(1, lot.remainingQuantity);
      form.setValue("quantity", newQuantity);
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
      const quantity = form.getValues("quantity");
      const rate = form.getValues("rate");
      const transportCost = form.getValues("transportCost");
      const brokerageAmount = form.getValues("brokerageAmount");
      const calculatedTotal = (quantity * rate) + transportCost + brokerageAmount;
      form.setValue("billAmount", calculatedTotal);
    }
  };

  const handleFormSubmit = (formData: SalesFormData) => {
    const subtotal = formData.quantity * formData.rate;
    const totalAmount = subtotal + formData.transportCost + formData.brokerageAmount;
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
        <SalesFormFields
          form={form}
          inventory={inventory}
          customers={customers}
          brokers={brokers}
          transporters={transporters}
          maxQuantity={maxQuantity}
          isCutBill={isCutBill}
          initialData={initialData}
          selectedLot={selectedLot}
          selectedBroker={selectedBroker}
          handleLotChange={handleLotChange}
          handleBrokerChange={handleBrokerChange}
          setIsCutBill={handleBillAmountToggle}
        />
        <div className="flex justify-between">
          <SalesFormSummary
            subtotal={form.watch("quantity") * form.watch("rate")}
            transportCost={form.watch("transportCost")}
            brokerageAmount={form.watch("brokerageAmount")}
            isCutBill={isCutBill}
            billAmount={form.watch("billAmount")}
          />
          <SalesFormActions
            initialData={initialData}
            onPrint={onPrint}
            isSubmitting={form.formState.isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
};

export default SalesForm;
