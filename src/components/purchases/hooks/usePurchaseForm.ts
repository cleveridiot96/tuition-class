
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Purchase } from "@/services/types";
import { addPurchase, updatePurchase } from "@/services/storageService";
import { useFormState } from './useFormState';
import { useItemManagement } from './useItemManagement';
import { useFormCalculations } from './useFormCalculations';
import { useBrokerageSettings } from './useBrokerageSettings';

interface UsePurchaseFormProps {
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

export const usePurchaseForm = ({ onSubmit, initialValues }: UsePurchaseFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formState, setFormState, handleInputChange, handleSelectChange } = useFormState(initialValues);
  const { handleItemChange, handleAddItem, handleRemoveItem } = useItemManagement(setFormState);
  const { calculateSubtotal, calculateTotal, totalAmount, transportCost, brokerageAmount, totalAfterExpenses, ratePerKgAfterExpenses } = useFormCalculations(formState);
  const { updateBrokerageSettings, calculateBrokerageAmount } = useBrokerageSettings(setFormState);

  // Calculate brokerage amount for UI display
  const brokerageAmountCalculated = calculateBrokerageAmount(formState.brokerageType, formState.brokerageRate, calculateSubtotal());
  
  // Expose brokerage type and rate for component usage
  const brokerageType = formState.brokerageType;
  const brokerageRate = formState.brokerageRate;

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate the final brokerage amount
      const finalBrokerageAmount = calculateBrokerageAmount(
        formState.brokerageType, 
        formState.brokerageRate,
        calculateSubtotal()
      );
      
      const purchaseData: Purchase = {
        id: initialValues?.id || Date.now().toString(),
        ...formState,
        // Add missing Purchase properties
        quantity: formState.items.reduce((total, item) => total + item.quantity, 0),
        netWeight: formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0) / (formState.items[0]?.rate || 1),
        rate: formState.items[0]?.rate || 0,
        totalAmount: calculateSubtotal(),
        totalAfterExpenses: calculateTotal(),
        brokerageAmount: finalBrokerageAmount,
        // Ensure these are included for type safety
        transportAmount: parseFloat(formState.transportCost || '0'),
        transportCost: parseFloat(formState.transportCost || '0'), // Convert string to number
        transportRate: initialValues?.transportRate || 0,
        brokerageValue: formState.brokerageRate, // Mapping brokerageRate to brokerageValue for API consistency
        location: formState.location,
        // Add bags property to Purchase
        bags: formState.bags || 0
      };

      if (initialValues) {
        updatePurchase(purchaseData);
        toast({
          title: "Purchase Updated",
          description: `Purchase ${purchaseData.lotNumber} has been updated.`
        });
      } else {
        addPurchase(purchaseData);
        toast({
          title: "Purchase Added",
          description: `Purchase ${purchaseData.lotNumber} has been added.`
        });
      }

      onSubmit(purchaseData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, initialValues, calculateSubtotal, calculateTotal, calculateBrokerageAmount, onSubmit, toast]);

  return {
    formState,
    setFormState,
    isSubmitting,
    brokerageAmount: brokerageAmountCalculated,
    brokerageType,
    brokerageRate,
    totalAmount,
    transportCost,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateTotal,
    handleSubmit,
    updateBrokerageSettings
  };
};
