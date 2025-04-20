
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "./PurchaseFormSchema";

interface UseFormCalculationsProps {
  form: UseFormReturn<PurchaseFormData>;
  showBrokerage: boolean;
  initialData?: any;
}

export const useFormCalculations = ({ form, showBrokerage, initialData }: UseFormCalculationsProps) => {
  const [totalAmount, setTotalAmount] = useState<number>(initialData?.totalAmount || 0);
  const [totalAfterExpenses, setTotalAfterExpenses] = useState<number>(initialData?.totalAfterExpenses || 0);
  const [ratePerKgAfterExpenses, setRatePerKgAfterExpenses] = useState<number>(initialData?.ratePerKgAfterExpenses || 0);
  const [transportCost, setTransportCost] = useState<number>(initialData?.transportCost || 0);
  const [brokerageAmount, setBrokerageAmount] = useState<number>(initialData?.brokerageAmount || 0);

  useEffect(() => {
    const values = form.getValues();
    const netWeight = values.netWeight || 0;
    const rate = values.rate || 0;
    const expenses = values.expenses || 0;
    const transportRate = values.transportRate || 0;
    
    const calculatedTransportCost = netWeight * transportRate;
    setTransportCost(calculatedTransportCost);
    
    const calculatedTotalAmount = netWeight * rate;
    setTotalAmount(calculatedTotalAmount);
    
    let calculatedBrokerageAmount = 0;
    if (showBrokerage && values.agentId) {
      const brokerageValue = values.brokerageValue || 1; // Default to 1% instead of 0
      if (values.brokerageType === "percentage") {
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
  }, [form.watch(), showBrokerage]);

  return {
    totalAmount,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    transportCost,
    brokerageAmount
  };
};
