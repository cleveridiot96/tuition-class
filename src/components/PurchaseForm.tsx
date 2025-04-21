
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getSuppliers,
  getTransporters,
  getAgents,
  getLocations,
} from '@/services/storageService';
import { purchaseFormSchema } from "./purchases/PurchaseFormSchema";
import { PurchaseFormProps, PurchaseFormData } from "./purchases/types/PurchaseTypes";
import { usePurchaseCalculations } from "./purchases/hooks/usePurchaseCalculations";
import { useBagExtractor } from "./purchases/hooks/useBagExtractor";
import { usePurchaseValidation } from "./purchases/hooks/usePurchaseValidation";
import PurchaseAccordion from "./purchases/components/PurchaseAccordion";
import PurchaseFormActions from "./purchases/components/PurchaseFormActions";
import DialogManager from "./purchases/components/DialogManager";

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // State
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(true);
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  const [pendingSubmitData, setPendingSubmitData] = useState<PurchaseFormData | null>(null);

  // Form setup
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
    },
    mode: "onChange" // Enable validation on field change
  });

  // Custom hooks
  const { totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, transportCost, brokerageAmount } = 
    usePurchaseCalculations({ form, showBrokerage, initialData });
  const { extractBagsFromLotNumber } = useBagExtractor({ form });
  const { validatePurchaseForm } = usePurchaseValidation();

  // Load initial data
  useEffect(() => {
    loadInitialData();
    
    if (initialData?.agentId) {
      setShowBrokerage(true);
    }
  }, [initialData]);

  // Extract bags from lot number
  useEffect(() => {
    const lotNumber = form.watch("lotNumber");
    if (lotNumber) {
      const extractedBags = extractBagsFromLotNumber(lotNumber);
      if (extractedBags) {
        form.setValue("bags", extractedBags);
      }
    }
  }, [form.watch("lotNumber")]);

  // Calculate transport cost
  useEffect(() => {
    const transportRate = form.watch("transportRate");
    const netWeight = form.watch("netWeight");
    
    if (transportRate > 0 && netWeight > 0) {
      const transportCost = transportRate * netWeight;
      console.log(`Transport cost calculated: ${transportCost} = ${transportRate} * ${netWeight}`);
    }
  }, [form.watch("transportRate"), form.watch("netWeight")]);

  // Helper functions
  const loadInitialData = () => {
    setSuppliers(getSuppliers());
    setTransporters(getTransporters());
    setAgents(getAgents());
    setLocations(getLocations());
  };

  // Form submission handler
  const handleFormSubmit = (data: PurchaseFormData) => {
    // Check if either party or agent is filled
    if (!data.party && !data.agentId) {
      form.setError("party", { 
        type: "manual", 
        message: "Either Party Name or Agent must be specified" 
      });
      form.setError("agentId", { 
        type: "manual", 
        message: "Either Party Name or Agent must be specified" 
      });
      toast.error("Either Party Name or Agent must be specified");
      return;
    }

    // Validate the form data
    const validation = validatePurchaseForm(data, !!initialData);
    
    if (!validation.isValid) {
      // If duplicate lot is found, show dialog
      if (validation.duplicatePurchase) {
        setDuplicateLotInfo(validation.duplicatePurchase);
        setShowDuplicateLotDialog(true);
        setPendingSubmitData(data);
        return;
      }
      // If other validation errors, they've been handled in the validation function
      return;
    }
    
    // If validation passes, submit the data
    submitData(data);
  };

  // Continue with submission after duplicate confirmation
  const handleContinueDespiteDuplicate = () => {
    if (pendingSubmitData) {
      submitData(pendingSubmitData);
      setPendingSubmitData(null);
    }
    setShowDuplicateLotDialog(false);
  };

  // Submit data to parent component
  const submitData = (data: PurchaseFormData) => {
    const submitData = {
      ...data,
      totalAmount: totalAmount,
      transportCost: transportCost,
      brokerageAmount: showBrokerage ? brokerageAmount : 0,
      totalAfterExpenses: totalAfterExpenses,
      ratePerKgAfterExpenses: ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };
    
    onSubmit(submitData);
    toast.success(initialData ? "Purchase updated successfully" : "Purchase added successfully");
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <PurchaseAccordion
                form={form}
                locations={locations}
                brokerageAmount={brokerageAmount}
                totalAmount={totalAmount}
                transportCost={transportCost}
                expenses={form.watch("expenses") || 0}
                totalAfterExpenses={totalAfterExpenses}
                ratePerKgAfterExpenses={ratePerKgAfterExpenses}
              />
              
              <PurchaseFormActions
                onCancel={onCancel}
                isSubmitting={form.formState.isSubmitting}
                isEdit={!!initialData}
              />
            </form>
          </Form>
        </div>
      </ScrollArea>

      <DialogManager
        showDuplicateLotDialog={showDuplicateLotDialog}
        setShowDuplicateLotDialog={setShowDuplicateLotDialog}
        duplicateLotInfo={duplicateLotInfo}
        onContinueDespiteDuplicate={handleContinueDespiteDuplicate}
      />
    </Card>
  );
};

export default PurchaseForm;
