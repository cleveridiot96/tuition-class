
import { useCallback } from 'react';

export const useBrokerageSettings = (setFormState: any) => {
  // Update brokerage settings in the form state
  const updateBrokerageSettings = useCallback((type: string, value: number) => {
    setFormState(prev => ({
      ...prev,
      brokerageType: type,
      brokerageRate: value
    }));
  }, [setFormState]);
  
  // Calculate brokerage amount based on type and value
  const calculateBrokerageAmount = useCallback((type: string, value: number, subtotal: number) => {
    if (type === "percentage") {
      return (subtotal * value) / 100; // Calculate percentage
    } else {
      return value; // Fixed amount
    }
  }, []);

  return { 
    updateBrokerageSettings,
    calculateBrokerageAmount
  };
};
