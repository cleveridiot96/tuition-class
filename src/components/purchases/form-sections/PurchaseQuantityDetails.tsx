
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { NumericInput } from "@/components/ui/numeric-input";
import { Input } from "@/components/ui/input";

interface PurchaseQuantityDetailsProps {
  form: any;
  formSubmitted?: boolean;
  extractBagsFromLotNumber: (lotNumber: string) => number | null;
}

const PurchaseQuantityDetails: React.FC<PurchaseQuantityDetailsProps> = ({
  form,
  formSubmitted = false,
  extractBagsFromLotNumber,
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const bags = form.watch("bags");
  const netWeight = form.watch("netWeight");
  const rate = form.watch("rate");

  const avgBagWeight = bags && netWeight ? (netWeight / bags) : 0;

  useEffect(() => {
    const lotNumber = form.getValues("lotNumber");
    if (lotNumber) {
      const extractedBags = extractBagsFromLotNumber(lotNumber);
      if (extractedBags !== null) {
        form.setValue("bags", extractedBags);
      }
    }
  }, [form.getValues("lotNumber"), extractBagsFromLotNumber, form]);

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Quantity Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bags"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Number of Bags</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <NumericInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  min={1}
                  step="1"
                  placeholder="0"
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
              <FormLabel className="flex justify-between">
                <span>Net Weight (kg)</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <NumericInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  min={1}
                  step="0.01"
                  placeholder="0.00"
                  className={fieldState.error && showErrors ? "border-red-500" : ""}
                />
              </FormControl>
              {avgBagWeight > 0 && (
                <FormDescription>
                  Avg. Bag Weight: {avgBagWeight.toFixed(2)} kg {avgBagWeight < 45 || avgBagWeight > 55 ? "(Warning: Unusual weight)" : ""}
                  Default: 50kg per bag
                </FormDescription>
              )}
              {showErrors && fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rate"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Rate (₹/kg)</span>
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <NumericInput
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  min={0.01}
                  step="0.01"
                  placeholder="0.00"
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
