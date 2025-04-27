
import React from "react";
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
import { safeNumber } from "@/lib/utils";

interface PurchaseQuantityDetailsProps {
  form: any;
  formSubmitted?: boolean;
  extractBagsFromLotNumber?: (lotNumber: string) => number | null;
}

const PurchaseQuantityDetails: React.FC<PurchaseQuantityDetailsProps> = ({
  form,
  formSubmitted = false,
  extractBagsFromLotNumber
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const DEFAULT_WEIGHT_PER_BAG = 50;
  
  const { 
    isWeightManuallyEdited,
    resetToAutoCalculation
  } = useBagWeightCalculation({
    form,
    defaultWeightPerBag: DEFAULT_WEIGHT_PER_BAG
  });

  // Calculate average bag weight
  const bags = safeNumber(form.watch('bags'));
  const netWeight = safeNumber(form.watch('netWeight'));
  const avgBagWeight = bags > 0 ? (netWeight / bags).toFixed(2) : DEFAULT_WEIGHT_PER_BAG.toFixed(2);

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
                  }}
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
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
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                  step="0.01"
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
                  step="0.01"
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
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
