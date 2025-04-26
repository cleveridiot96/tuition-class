import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getSuppliers,
  getTransporters,
  getAgents,
  getLocations,
} from '@/services/storageService';
import { purchaseFormSchema } from "./PurchaseFormSchema";
import { PurchaseFormProps, PurchaseFormData } from "./types/PurchaseTypes";
import { usePurchaseCalculations } from "./hooks/usePurchaseCalculations";
import { useBagExtractor } from "./hooks/useBagExtractor";
import { usePurchaseValidation } from "./hooks/usePurchaseValidation";
import { usePartyManagement } from "./usePartyManagement";
import PurchaseFormContent from "./PurchaseFormContent";

const AUTO_REFRESH_INTERVAL = 1000; // 1 second

const PurchaseFormController: React.FC<PurchaseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  // State
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>(['Mumbai', 'Chiplun', 'Sawantwadi']); // Default locations
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false); // Default to hidden
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  const [pendingSubmitData, setPendingSubmitData] = useState<PurchaseFormData | null>(null);

  // Form setup with default values and changed mode
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
      brokerageValue: initialData?.brokerageValue || 1,
      notes: initialData?.notes || "",
      agentId: initialData?.agentId || "",
      billNumber: initialData?.billNumber || "",
      billAmount: initialData?.billAmount || 0,
    },
    mode: "onSubmit"
  });

  // Load entities data
  const loadData = () => {
    setSuppliers(getSuppliers().filter(s => !s.isDeleted) || []);
    setTransporters(getTransporters().filter(t => !t.isDeleted) || []);
    setAgents(getAgents().filter(a => !a.isDeleted) || []);
    
    // Set default locations if none are found
    const storedLocations = getLocations();
    if (storedLocations && storedLocations.length > 0) {
      setLocations(storedLocations);
    }
  };

  // Setup auto-refresh for data
  useEffect(() => {
    loadData(); // Initial load
    
    const refreshInterval = setInterval(() => {
      loadData();
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Setup party management
  const partyManagement = usePartyManagement({ form, loadData });

  // Custom hooks
  const { totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, transportCost, brokerageAmount } =
    usePurchaseCalculations({ form, showBrokerage, initialData });
  const { extractBagsFromLotNumber } = useBagExtractor({ form });
  const { validatePurchaseForm } = usePurchaseValidation();

  // Load initial data
  useEffect(() => {
    // Only show brokerage when agent is selected
    const agentId = form.watch("agentId");
    setShowBrokerage(!!agentId);
  }, [initialData, form]);

  // Toggle brokerage visibility based on agent selection
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'agentId') {
        setShowBrokerage(!!value.agentId);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Extract bags from lot number and calculate weight
  useEffect(() => {
    const lotNumber = form.watch("lotNumber");
    if (lotNumber) {
      const extractedBags = extractBagsFromLotNumber(lotNumber);
      if (extractedBags) {
        form.setValue("bags", extractedBags);
        
        // Default weight calculation (50kg per bag)
        const currentNetWeight = form.getValues("netWeight");
        if (!currentNetWeight || currentNetWeight === 0) {
          form.setValue("netWeight", extractedBags * 50);
        }
      }
    }
  }, [form.watch("lotNumber"), form, extractBagsFromLotNumber]);

  // Update bag weight calculation
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bags') {
        const bags = parseInt(value.bags as string) || 0;
        const currentNetWeight = form.getValues('netWeight');
        
        // Only update net weight if it hasn't been manually set
        if (!currentNetWeight || currentNetWeight === 0) {
          form.setValue('netWeight', bags * 50); // Default 50kg per bag
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Form submission handler
  const handleFormSubmit = (data: PurchaseFormData) => {
    // Explicit type conversion for expenses
    const expenses = typeof data.expenses === 'string' 
      ? parseFloat(data.expenses) || 0 
      : data.expenses || 0;

    const dataWithFixedExpenses = {
      ...data,
      expenses: Number(expenses)
    };

    const validation = validatePurchaseForm(dataWithFixedExpenses, !!initialData);

    if (!validation.isValid) {
      if (validation.duplicatePurchase) {
        setDuplicateLotInfo(validation.duplicatePurchase);
        setShowDuplicateLotDialog(true);
        setPendingSubmitData(dataWithFixedExpenses);
        return;
      }
      return;
    }

    submitData(dataWithFixedExpenses);
  };

  const handleContinueDespiteDuplicate = () => {
    if (pendingSubmitData) {
      submitData(pendingSubmitData);
      setPendingSubmitData(null);
    }
    setShowDuplicateLotDialog(false);
  };

  const submitData = (data: PurchaseFormData) => {
    // Ensure expenses is a number
    const expenses = Number(data.expenses || 0);
      
    const submitData = {
      ...data,
      expenses,  // Use the converted number value
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
    <PurchaseFormContent
      form={form}
      onCancel={onCancel}
      isSubmitting={form.formState.isSubmitting}
      isEdit={!!initialData}
      locations={locations}
      brokerageAmount={brokerageAmount}
      totalAmount={totalAmount}
      transportCost={transportCost}
      totalAfterExpenses={totalAfterExpenses}
      ratePerKgAfterExpenses={ratePerKgAfterExpenses}
      extractBagsFromLotNumber={extractBagsFromLotNumber}
      showBrokerage={showBrokerage}
      initialData={initialData}
      expenses={form.watch("expenses") || 0}
      showDuplicateLotDialog={showDuplicateLotDialog}
      setShowDuplicateLotDialog={setShowDuplicateLotDialog}
      duplicateLotInfo={duplicateLotInfo}
      onContinueDespiteDuplicate={handleContinueDespiteDuplicate}
      handleFormSubmit={handleFormSubmit}
      partyManagement={partyManagement}
    />
  );
};

export default PurchaseFormController;
