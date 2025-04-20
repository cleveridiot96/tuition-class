
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import {
  getSuppliers,
  getTransporters,
  getAgents,
  checkDuplicateLot,
  getPurchases,
  getLocations,
} from '@/services/storageService';
import { purchaseFormSchema } from "./purchases/PurchaseFormSchema";
import { PurchaseFormProps, PurchaseFormData } from "./purchases/types/PurchaseTypes";
import { useFormCalculations } from "./purchases/hooks/useFormCalculations";
import { useBagExtractor } from "./purchases/hooks/useBagExtractor";
import PurchaseFormHeader from "./purchases/components/PurchaseFormHeader";
import PurchaseDetails from "./purchases/components/PurchaseDetails";
import BrokerageDetails from "./purchases/BrokerageDetails";
import PurchaseSummary from "./purchases/PurchaseSummary";
import DuplicateLotDialog from "./purchases/DuplicateLotDialog";

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit, initialData }) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(true);
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      lotNumber: initialData?.lotNumber || "",
      bags: initialData?.bags || 0,
      party: initialData?.party || "",
      location: initialData?.location || "",
      netWeight: initialData?.netWeight || 0,
      rate: initialData?.rate || 0,
      transporterId: initialData?.transporterId || "",
      transportRate: initialData?.transportRate || 0,
      expenses: initialData?.expenses || 0,
      brokerageType: initialData?.brokerageType || "percentage",
      brokerageValue: initialData?.brokerageValue || 1, // Default 1%
      notes: initialData?.notes || "",
      agentId: initialData?.agentId || "",
      billNumber: initialData?.billNumber || "",
      billAmount: initialData?.billAmount || undefined,
    }
  });

  // Create a formState object compatible with our calculations hooks
  const formState = {
    lotNumber: form.watch("lotNumber") || "",
    date: form.watch("date") || "",
    location: form.watch("location") || "",
    agentId: form.watch("agentId") || "",
    transporterId: form.watch("transporterId") || "",
    transportCost: form.watch("transportRate") ? (form.watch("transportRate") * form.watch("netWeight")).toString() : "0",
    items: [{ id: "1", name: "", quantity: form.watch("netWeight") || 0, rate: form.watch("rate") || 0 }],
    notes: form.watch("notes") || "",
    expenses: form.watch("expenses") || 0,
    totalAfterExpenses: 0,
    brokerageType: form.watch("brokerageType") || "percentage",
    brokerageRate: form.watch("brokerageValue") || 1,
    bags: form.watch("bags") || 0,
  };

  const calculations = useFormCalculations(formState);
  
  // Use the bag extractor hook
  const { extractBagsFromLotNumber } = useBagExtractor({ form });

  useEffect(() => {
    loadInitialData();
    
    if (initialData?.agentId) {
      setShowBrokerage(true);
    }
  }, [initialData]);

  const loadInitialData = () => {
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
    setAgents(getAgents());
    setLocations(getLocations());
  };

  const handleFormSubmit = (data: PurchaseFormData) => {
    if (checkDuplicateLot(data.lotNumber) && !initialData) {
      const existingPurchase = getPurchases().find(p => p.lotNumber === data.lotNumber && !p.isDeleted);
      if (existingPurchase) {
        setDuplicateLotInfo(existingPurchase);
        setShowDuplicateLotDialog(true);
        return;
      }
    }
    
    const submitData = {
      ...data,
      totalAmount: calculations.totalAmount,
      transportCost: calculations.transportCost,
      brokerageAmount: showBrokerage ? calculations.brokerageAmount : 0,
      totalAfterExpenses: calculations.totalAfterExpenses,
      ratePerKgAfterExpenses: calculations.ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    onSubmit(submitData);
    toast.success(initialData ? "Purchase updated successfully" : "Purchase added successfully");
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <PurchaseFormHeader form={form} />
          <PurchaseDetails form={form} locations={locations} />
          
          <BrokerageDetails 
            form={form} 
            brokerageAmount={calculations.brokerageAmount} 
            totalAmount={calculations.totalAmount}
          />
          
          <PurchaseSummary 
            totalAmount={calculations.totalAmount}
            transportCost={calculations.transportCost}
            brokerageAmount={calculations.brokerageAmount}
            expenses={form.watch("expenses") || 0}
            totalAfterExpenses={calculations.totalAfterExpenses}
            ratePerKgAfterExpenses={calculations.ratePerKgAfterExpenses}
          />
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              {initialData ? "Update Purchase" : "Add Purchase"}
            </Button>
          </div>
        </form>
      </Form>

      <DuplicateLotDialog
        open={showDuplicateLotDialog}
        onOpenChange={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        continueDespiteDuplicate={() => {
          setShowDuplicateLotDialog(false);
          handleFormSubmit(form.getValues());
        }}
      />
    </Card>
  );
};

export default PurchaseForm;
