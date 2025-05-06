
import { useCallback, useState, useEffect } from 'react';
import { PurchaseFormState } from '../types/PurchaseFormTypes';

export const useFormCalculations = (formState: PurchaseFormState) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(0);

  const calculateSubtotal = useCallback(() => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  }, [formState.items]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const transportCostValue = parseFloat(formState.transportCost || '0');
    // Ensure expenses is always a number
    const expenses = typeof formState.expenses === 'number' 
      ? formState.expenses 
      : parseFloat(String(formState.expenses || '0'));
      
    return subtotal + transportCostValue + expenses;
  }, [formState.items, formState.transportCost, formState.expenses, calculateSubtotal]);

  // Calculate all values whenever form state changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    setTotalAmount(subtotal);

    const transportCostValue = parseFloat(formState.transportCost || '0');
    setTransportCost(transportCostValue);

    // Ensure expenses is always a number
    const expenses = typeof formState.expenses === 'number' 
      ? formState.expenses 
      : parseFloat(String(formState.expenses || '0'));

    // Calculate brokerage based on type and rate
    let brokerage = 0;
    if (formState.brokerageType === 'percentage') {
      brokerage = (subtotal * formState.brokerageRate) / 100;
    } else {
      brokerage = formState.brokerageRate;
    }
    setBrokerageAmount(brokerage);

    const total = subtotal + transportCostValue + expenses + brokerage;
    setTotalAfterExpenses(total);

    const netWeight = formState.items.reduce((total, item) => total + item.quantity, 0);
    const ratePerKg = netWeight > 0 ? total / netWeight : 0;
    setRatePerKgAfterExpenses(ratePerKg);
  }, [formState, calculateSubtotal]);

  return {
    totalAmount,
    transportCost,
    brokerageAmount,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    calculateSubtotal,
    calculateTotal
  };
};
