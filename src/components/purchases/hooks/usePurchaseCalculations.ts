
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

interface UsePurchaseCalculationsProps {
  form: UseFormReturn<PurchaseFormData>;
  showBrokerage: boolean;
  initialData?: any;
}

export const usePurchaseCalculations = ({ 
  form, 
  showBrokerage, 
  initialData 
}: UsePurchaseCalculationsProps) => {
  const [totalAmount, setTotalAmount] = useState<number>(initialData?.totalAmount || 0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(initialData?.totalAfterExpenses || 0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(initialData?.ratePerKgAfterExpenses || 0);
  const [transportCost, setTransportCost] = useState<number>(initialData?.transportCost || 0);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(initialData?.brokerageAmount || 0);

  // This effect runs whenever form fields change to recalculate all values
  useEffect(() => {
    // Safe number conversion function
    const safeNumber = (value: any): number => {
      if (value === null || value === undefined || isNaN(parseFloat(value))) {
        return 0;
      }
      return parseFloat(value);
    };

    const subscription = form.watch((value, { name }) => {
      const formValues = form.getValues();
      const netWeight = safeNumber(formValues.netWeight);
      const rate = safeNumber(formValues.rate);
      const expenses = safeNumber(formValues.expenses);
      const transportRate = safeNumber(formValues.transportRate);
      
      // Calculate transport cost
      const calculatedTransportCost = netWeight * transportRate;
      setTransportCost(calculatedTransportCost);
      
      // Calculate total amount
      const calculatedTotalAmount = netWeight * rate;
      setTotalAmount(calculatedTotalAmount);
      
      // Calculate brokerage
      let calculatedBrokerageAmount = 0;
      if (showBrokerage) {
        const brokerageValue = safeNumber(formValues.brokerageValue || 1); // Default 1%
        if (formValues.brokerageType === "percentage") {
          calculatedBrokerageAmount = (calculatedTotalAmount * brokerageValue) / 100;
        } else {
          calculatedBrokerageAmount = brokerageValue;
        }
      }
      setBrokerageAmount(calculatedBrokerageAmount);
      
      // Calculate total after expenses
      const calculatedTotalAfterExpenses = calculatedTotalAmount + expenses + calculatedTransportCost + calculatedBrokerageAmount;
      setTotalAfterExpenses(calculatedTotalAfterExpenses);
      
      // Calculate rate per kg after expenses
      const calculatedRatePerKg = netWeight > 0 ? calculatedTotalAfterExpenses / netWeight : 0;
      setRatePerKgAfterExpenses(calculatedRatePerKg);
    });

    // Immediate calculation on component mount
    const formValues = form.getValues();
    const netWeight = safeNumber(formValues.netWeight);
    const rate = safeNumber(formValues.rate);
    const expenses = safeNumber(formValues.expenses);
    const transportRate = safeNumber(formValues.transportRate);
    
    const calculatedTransportCost = netWeight * transportRate;
    setTransportCost(calculatedTransportCost);
    
    const calculatedTotalAmount = netWeight * rate;
    setTotalAmount(calculatedTotalAmount);
    
    let calculatedBrokerageAmount = 0;
    if (showBrokerage) {
      const brokerageValue = safeNumber(formValues.brokerageValue || 1); // Default 1%
      if (formValues.brokerageType === "percentage") {
        calculatedBrokerageAmount = (calculatedTotalAmount * brokerageValue) / 100;
      } else {
        calculatedBrokerageAmount = brokerageValue;
      }
    }
    setBrokerageAmount(calculatedBrokerageAmount);
    
    const calculatedTotalAfterExpenses = calculatedTotalAmount + expenses + calculatedTransportCost + calculatedBrokerageAmount;
    setTotalAfterExpenses(calculatedTotalAfterExpenses);
    
    const calculatedRatePerKg = netWeight > 0 ? calculatedTotalAfterExpenses / netWeight : 0;
    setRatePerKgAfterExpenses(calculatedRatePerKg);
    
    return () => subscription.unsubscribe();
  }, [form, showBrokerage]);

  return {
    totalAmount,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    transportCost,
    brokerageAmount
  };
};
