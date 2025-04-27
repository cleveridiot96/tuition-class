
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseBagWeightCalculationProps {
  form: UseFormReturn<any>;
  defaultWeightPerBag: number;
}

export const useBagWeightCalculation = ({
  form,
  defaultWeightPerBag = 50
}: UseBagWeightCalculationProps) => {
  const [isWeightManuallyEdited, setIsWeightManuallyEdited] = useState(false);

  useEffect(() => {
    // Set up watcher for weight field
    const subscription = form.watch((value, { name }) => {
      if (name === 'netWeight') {
        const bags = parseInt(value.bags) || 0;
        const weight = parseFloat(value.netWeight) || 0;
        const expectedWeight = bags * defaultWeightPerBag;
        
        // If weight differs from expected, it was manually edited
        if (weight !== expectedWeight && weight !== 0 && bags !== 0) {
          setIsWeightManuallyEdited(true);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, defaultWeightPerBag]);
  
  const resetToAutoCalculation = () => {
    const bags = parseInt(form.getValues('bags')) || 0;
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
