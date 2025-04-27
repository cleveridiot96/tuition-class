
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { purchaseFormSchema } from '../PurchaseFormSchema';
import { PurchaseFormData, PurchaseFormProps } from '../types/PurchaseTypes';
import { usePurchaseCalculations } from './usePurchaseCalculations';
import { useBagExtractor } from './useBagExtractor';
import { usePurchaseValidation } from './usePurchaseValidation';
import { safeNumber } from '@/lib/utils';

export const usePurchaseForm = ({ onSubmit, onCancel, initialData }: PurchaseFormProps) => {
  const [showDuplicateLotDialog, setShowDuplicateLotDialog] = useState<boolean>(false);
  const [duplicateLotInfo, setDuplicateLotInfo] = useState<any>(null);
  const [pendingSubmitData, setPendingSubmitData] = useState<PurchaseFormData | null>(null);
  const [showBrokerage, setShowBrokerage] = useState<boolean>(false);

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      lotNumber: initialData?.lotNumber || '',
      bags: initialData?.bags || 0,
      party: initialData?.party || '',
      location: initialData?.location || '',
      netWeight: initialData?.netWeight || 0,
      rate: initialData?.rate || 0,
      transporterId: initialData?.transporterId || '',
      transportRate: initialData?.transportRate || 0,
      expenses: initialData?.expenses || 0,
      brokerageType: initialData?.brokerageType || 'percentage',
      brokerageValue: initialData?.brokerageValue || 1,
      notes: initialData?.notes || '',
      agentId: initialData?.agentId || '',
      billNumber: initialData?.billNumber || '',
      billAmount: initialData?.billAmount || 0,
    },
    mode: 'onSubmit'
  });

  const { totalAmount, totalAfterExpenses, ratePerKgAfterExpenses, transportCost, brokerageAmount } =
    usePurchaseCalculations({ form, showBrokerage, initialData });
  const { extractBagsFromLotNumber } = useBagExtractor({ form });
  const { validatePurchaseForm } = usePurchaseValidation();

  // Handle form submission
  const handleFormSubmit = (data: PurchaseFormData) => {
    // Ensure expenses is always a valid number before submission
    const expenses = safeNumber(data.expenses, 0);

    const dataWithFixedExpenses = {
      ...data,
      expenses: expenses
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
    const expenses = safeNumber(data.expenses, 0);
      
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
