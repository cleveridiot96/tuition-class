
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
}

const PurchaseQuantityDetails: React.FC<PurchaseQuantityDetailsProps> = ({
  form,
  extractBagsFromLotNumber
}) => {
  const [avgBagWeight, setAvgBagWeight] = useState('50');
  const DEFAULT_WEIGHT_PER_BAG = 50;
  
  const { 
    isWeightManuallyEdited,
    resetToAutoCalculation
  } = useBagWeightCalculation({
    form,
    defaultWeightPerBag: DEFAULT_WEIGHT_PER_BAG
  });

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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Bags <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    field.onChange(value);
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field }) => (
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PurchaseQuantityDetails;
