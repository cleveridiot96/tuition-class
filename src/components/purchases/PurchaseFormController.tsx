
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
    mode: "onChange"
  });

  // Load entities data
  const loadData = () => {
    setSuppliers(getSuppliers() || []);
    setTransporters(getTransporters() || []);
    setAgents(getAgents() || []);
    
    // Set default locations if none are found
    const storedLocations = getLocations();
    if (storedLocations && storedLocations.length > 0) {
      setLocations(storedLocations);
    }
  };

  // Setup party management
  const partyManagement = usePartyManagement({ form, loadData });

  // Custom hooks
  const { totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, transportCost, brokerageAmount } =
    usePurchaseCalculations({ form, showBrokerage, initialData });
  const { extractBagsFromLotNumber } = useBagExtractor({ form });
  const { validatePurchaseForm } = usePurchaseValidation();

  // Load initial data
  useEffect(() => {
    loadData();
    // Only show brokerage when agent is selected
    const agentId = form.watch("agentId");
    setShowBrokerage(!!agentId);
  }, [initialData]);

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
  }, [form.watch("lotNumber")]);

  // Update net weight when bags change (50kg per bag default)
  useEffect(() => {
    const bags = form.watch("bags");
    const netWeight = form.watch("netWeight");
    
    // Only update if netWeight is not manually set
    if (bags > 0 && (!netWeight || netWeight === 0)) {
      form.setValue("netWeight", bags * 50);
    }
  }, [form.watch("bags")]);

  // Form submission handler
  const handleFormSubmit = (data: PurchaseFormData) => {
    // Check if either Party OR Agent is specified (not both required)
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

    const validation = validatePurchaseForm(data, !!initialData);

    if (!validation.isValid) {
      if (validation.duplicatePurchase) {
        setDuplicateLotInfo(validation.duplicatePurchase);
        setShowDuplicateLotDialog(true);
        setPendingSubmitData(data);
        return;
      }
      return;
    }

    submitData(data);
  };

  const handleContinueDespiteDuplicate = () => {
    if (pendingSubmitData) {
      submitData(pendingSubmitData);
      setPendingSubmitData(null);
    }
    setShowDuplicateLotDialog(false);
  };

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
