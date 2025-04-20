
import { useCallback } from 'react';
import { PurchaseFormState } from '../types/PurchaseFormTypes';

export const useFormCalculations = (formState: PurchaseFormState) => {
  const calculateSubtotal = useCallback(() => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  }, [formState.items]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    const expenses = parseFloat(formState.expenses?.toString() || '0');
    return subtotal + transportCost + expenses;
  }, [formState.items, formState.transportCost, formState.expenses, calculateSubtotal]);

  return {
    calculateSubtotal,
    calculateTotal
  };
};
