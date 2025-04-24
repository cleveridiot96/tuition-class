
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseBagWeightCalculationProps {
  form: UseFormReturn<any>;
  bagFieldName?: string;
  weightFieldName?: string;
  defaultWeightPerBag?: number;
}

/**
 * A hook to handle bag weight calculations with manual override capability
 * By default, each bag weighs 50kg, but the user can manually override this
 */
export const useBagWeightCalculation = ({
  form,
  bagFieldName = 'bags', 
  weightFieldName = 'netWeight',
  defaultWeightPerBag = 50
}: UseBagWeightCalculationProps) => {
  const [isWeightManuallyEdited, setIsWeightManuallyEdited] = useState(false);
  const [lastBagCount, setLastBagCount] = useState(0);
  const [lastCalculatedWeight, setLastCalculatedWeight] = useState(0);
  
  // Watch for changes in the number of bags
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === bagFieldName && type === 'change') {
        const bagCount = value[bagFieldName] || 0;
        
        // If the current weight matches what would have been calculated previously,
        // it's likely not manually edited
        const currentWeight = value[weightFieldName] || 0;
        const previousCalculatedWeight = lastBagCount * defaultWeightPerBag;
        
        // Check if the weight is still in sync with auto-calculation
        const isWeightInSync = Math.abs(currentWeight - previousCalculatedWeight) < 0.001;
        
        // Only auto-update if weight was not manually edited
        if (!isWeightManuallyEdited || isWeightInSync) {
          const newWeight = bagCount * defaultWeightPerBag;
          form.setValue(weightFieldName, newWeight);
          setLastCalculatedWeight(newWeight);
        }
        
        setLastBagCount(bagCount);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, bagFieldName, weightFieldName, defaultWeightPerBag, isWeightManuallyEdited, lastBagCount]);
  
  // Function to manually set weight
  const setManualWeight = (weight: number) => {
    form.setValue(weightFieldName, weight);
    setIsWeightManuallyEdited(true);
  };
  
  // Function to reset to automatic calculation
  const resetToAutoCalculation = () => {
    const bagCount = form.getValues(bagFieldName) || 0;
    const newWeight = bagCount * defaultWeightPerBag;
    form.setValue(weightFieldName, newWeight);
    setIsWeightManuallyEdited(false);
    setLastCalculatedWeight(newWeight);
    setLastBagCount(bagCount);
  };
  
  return {
    isWeightManuallyEdited,
    setManualWeight,
    resetToAutoCalculation,
    defaultWeightPerBag,
    lastCalculatedWeight
  };
};
