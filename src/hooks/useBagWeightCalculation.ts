
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { safeNumber } from '@/lib/utils';

interface UseBagWeightCalculationProps {
  form: UseFormReturn<any>;
  defaultWeightPerBag?: number;
}

export const useBagWeightCalculation = ({
  form,
  defaultWeightPerBag = 50
}: UseBagWeightCalculationProps) => {
  const [isWeightManuallyEdited, setIsWeightManuallyEdited] = useState(false);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'bags') {
        const bags = safeNumber(value.bags);
        if (!isWeightManuallyEdited) {
          const calculatedWeight = bags * defaultWeightPerBag;
          form.setValue('netWeight', calculatedWeight, { shouldValidate: true });
        }
      }

      if (name === 'netWeight' && value.bags) {
        const bags = safeNumber(value.bags);
        const weight = safeNumber(value.netWeight);
        const expectedWeight = bags * defaultWeightPerBag;
        
        if (weight !== expectedWeight && weight !== 0 && bags !== 0) {
          setIsWeightManuallyEdited(true);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, defaultWeightPerBag, isWeightManuallyEdited]);
  
  const resetToAutoCalculation = () => {
    const bags = safeNumber(form.getValues('bags'));
    const calculatedWeight = bags * defaultWeightPerBag;
    form.setValue('netWeight', calculatedWeight);
    setIsWeightManuallyEdited(false);
  };
  
  return {
    isWeightManuallyEdited,
    setIsWeightManuallyEdited,
    resetToAutoCalculation
  };
};
