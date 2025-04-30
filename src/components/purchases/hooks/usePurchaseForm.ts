
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { purchaseFormSchema } from '../PurchaseFormSchema';
import { PurchaseFormData, PurchaseFormProps } from '../types/PurchaseTypes';
import { usePurchaseCalculations } from './usePurchaseCalculations';
import { useBagExtractor } from './useBagExtractor';
import { usePurchaseValidation } from './usePurchaseValidation';
import { usePurchaseValidationRules } from './usePurchaseValidationRules';
import { safeNumber } from '@/lib/utils';

export const usePurchaseForm = ({ onSubmit, onCancel, initialData }: PurchaseFormProps) => {
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  const [pendingSubmitData, setPendingSubmitData] = useState<PurchaseFormData | null>(null);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(!!initialData?.agentId);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Helper function to ensure numeric values are properly initialized
  const ensureNumber = (value: any, defaultValue = 0): number => {
    if (value === null || value === undefined || isNaN(parseFloat(value))) {
      return defaultValue;
    }
    return parseFloat(value);
  };

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      lotNumber: initialData?.lotNumber || '',
      bags: ensureNumber(initialData?.bags, 0),
      party: initialData?.party || '',
      location: initialData?.location || '',
      netWeight: ensureNumber(initialData?.netWeight, 0),
      rate: ensureNumber(initialData?.rate, 0),
      transporterId: initialData?.transporterId || '',
      transportRate: ensureNumber(initialData?.transportRate, 0),
      expenses: ensureNumber(initialData?.expenses, 0),
      brokerageType: initialData?.brokerageType || 'percentage',
      brokerageValue: ensureNumber(initialData?.brokerageValue, 1),
      notes: initialData?.notes || '',
      agentId: initialData?.agentId || '',
      billNumber: initialData?.billNumber || '',
      billAmount: ensureNumber(initialData?.billAmount, 0),
    },
    mode: 'onSubmit', // Changed from onChange to onSubmit
    reValidateMode: 'onSubmit' // Added to prevent revalidation on change
  });

  const { totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, transportCost, brokerageAmount } =
    usePurchaseCalculations({ form, showBrokerage, initialData });
  const { extractBagsFromLotNumber } = useBagExtractor({ form });
  const { validatePurchaseForm } = usePurchaseValidation();
  const validationRules = usePurchaseValidationRules(form);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'agentId') {
        setShowBrokerage(!!value.agentId);
      }
      
      if (name === 'lotNumber') {
        const lotNumber = value.lotNumber as string;
        const extractedBags = extractBagsFromLotNumber(lotNumber);
        if (extractedBags !== null) {
          form.setValue('bags', extractedBags);
        }
      }
      
      // Auto-calculate weight based on bags (50kg per bag)
      if (name === 'bags') {
        const bags = safeNumber(value.bags, 0);
        const calculatedWeight = bags * 50;
        form.setValue('netWeight', calculatedWeight);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, extractBagsFromLotNumber]);

  const handleFormSubmit = async (data: PurchaseFormData) => {
    setFormSubmitted(true);
    
    const supplierValid = await validationRules.validateSupplier(data.party || '');
    const agentValid = await validationRules.validateAgent(data.agentId || '');
    const transporterValid = await validationRules.validateTransporter(data.transporterId || '');

    if (supplierValid !== true) {
      form.setError('party', { type: 'manual', message: supplierValid as string });
      return;
    }

    if (agentValid !== true) {
      form.setError('agentId', { type: 'manual', message: agentValid as string });
      return;
    }

    if (data.transporterId && transporterValid !== true) {
      form.setError('transporterId', { type: 'manual', message: transporterValid as string });
      return;
    }

    // Ensure all numeric fields are properly parsed
    const dataWithFixedNumbers = {
      ...data,
      bags: ensureNumber(data.bags, 0),
      netWeight: ensureNumber(data.netWeight, 0),
      rate: ensureNumber(data.rate, 0),
      transportRate: ensureNumber(data.transportRate, 0),
      expenses: ensureNumber(data.expenses, 0),
      brokerageValue: ensureNumber(data.brokerageValue, 1),
      billAmount: data.billAmount ? ensureNumber(data.billAmount, 0) : null
    };

    const validation = validatePurchaseForm(dataWithFixedNumbers, !!initialData);

    if (!validation.isValid) {
      if (validation.duplicatePurchase) {
        setDuplicateLotInfo(validation.duplicatePurchase);
        setShowDuplicateLotDialog(true);
        setPendingSubmitData(dataWithFixedNumbers);
        return;
      }
      return;
    }

    submitData(dataWithFixedNumbers);
  };

  const handleContinueDespiteDuplicate = () => {
    if (pendingSubmitData) {
      submitData(pendingSubmitData);
      setPendingSubmitData(null);
    }
    setShowDuplicateLotDialog(false);
  };

  const submitData = (data: PurchaseFormData) => {
    const expenses = ensureNumber(data.expenses, 0);
      
    const submitData = {
      ...data,
      expenses,
      totalAmount,
      transportCost,
      brokerageAmount: showBrokerage ? brokerageAmount : 0,
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      id: initialData?.id || Date.now().toString()
    };

    onSubmit(submitData);
    toast.success(initialData ? "Purchase updated successfully" : "Purchase added successfully");
  };

  return {
    form,
    formSubmitted,
    showBrokerage,
    setShowBrokerage,
    showDuplicateLotDialog,
    setShowDuplicateLotDialog,
    duplicateLotInfo,
    handleFormSubmit,
    handleContinueDespiteDuplicate,
    totalAmount,
    transportCost,
    brokerageAmount,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    extractBagsFromLotNumber
  };
};
