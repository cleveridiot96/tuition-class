
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
  const { calculateSubtotal, calculateTotal } = useFormCalculations(formState);
  const { updateBrokerageSettings } = useBrokerageSettings(setFormState);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const purchaseData: Purchase = {
        id: initialValues?.id || Date.now().toString(),
        ...formState,
        totalAmount: calculateTotal(),
        totalAfterExpenses: calculateTotal()
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
  }, [formState, initialValues, calculateTotal, onSubmit, toast]);

  return {
    formState,
    setFormState,
    isSubmitting,
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
