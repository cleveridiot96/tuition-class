
import React, { useEffect, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useBagWeightCalculation } from "@/hooks/useBagWeightCalculation";

interface PurchaseQuantityDetailsProps {
  form: any;
  extractBagsFromLotNumber: (lotNumber: string) => number | null;
  formSubmitted?: boolean;
}

const PurchaseQuantityDetails: React.FC<PurchaseQuantityDetailsProps> = ({
  form,
  extractBagsFromLotNumber,
  formSubmitted = false
}) => {
  const [avgBagWeight, setAvgBagWeight] = useState('50');
  const DEFAULT_WEIGHT_PER_BAG = 50;
  const showErrors = formSubmitted || form.formState.isSubmitted;
  
  const { 
    isWeightManuallyEdited,
    resetToAutoCalculation
  } = useBagWeightCalculation({
    form,
    defaultWeightPerBag: DEFAULT_WEIGHT_PER_BAG
  });

  // Auto-extract bags from lot number on initial load
  useEffect(() => {
    const lotNumber = form.getValues('lotNumber');
    if (lotNumber && !form.getValues('bags')) {
      const extractedBags = extractBagsFromLotNumber(lotNumber);
      if (extractedBags !== null) {
        form.setValue('bags', extractedBags);
        
        // Auto calculate weight if not already set
        if (!form.getValues('netWeight')) {
          form.setValue('netWeight', extractedBags * DEFAULT_WEIGHT_PER_BAG);
        }
      }
    }
  }, [form, extractBagsFromLotNumber, DEFAULT_WEIGHT_PER_BAG]);

  useEffect(() => {
    const subscription = form.watch((value: any) => {
      const bags = parseInt(value.bags) || 0;
      const weight = parseFloat(value.netWeight) || 0;
      
      if (bags > 0 && weight > 0) {
        setAvgBagWeight((weight / bags).toFixed(2));
      } else {
        setAvgBagWeight('50.00');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Quantity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bags"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Number of Bags <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    field.onChange(value);
                    
                    // Auto calculate weight if not manually edited
                    if (!isWeightManuallyEdited) {
                      form.setValue('netWeight', value * DEFAULT_WEIGHT_PER_BAG);
                    }
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Net Weight (kg) <span className="text-red-500">*</span>
                {isWeightManuallyEdited && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs ml-2"
                    onClick={resetToAutoCalculation}
                  >
                    <Calculator className="w-3 h-3 mr-1" /> Auto
                  </Button>
                )}
              </FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Avg. Bag Weight: {avgBagWeight} kg</span>
                <span>Default: {DEFAULT_WEIGHT_PER_BAG}kg per bag</span>
              </div>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Rate (₹/kg) <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  step="0.01" 
                />
              </FormControl>
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseQuantityDetails;
