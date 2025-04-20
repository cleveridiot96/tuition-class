
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { toast } from "sonner";

interface UseBagExtractorProps {
  form: UseFormReturn<PurchaseFormData>;
}

export const useBagExtractor = ({ form }: UseBagExtractorProps) => {
  useEffect(() => {
    // Initial extraction if there's already a lot number when component mounts
    const lotNumber = form.getValues().lotNumber;
    if (lotNumber) {
      extractBagsFromLotNumber(lotNumber);
    }
    
    // Subscribe to lot number changes
    const subscription = form.watch((value, { name }) => {
      if (name === 'lotNumber') {
        extractBagsFromLotNumber(value.lotNumber || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  const extractBagsFromLotNumber = (lotNumber: string) => {
    console.log("Extracting bags from lot number:", lotNumber);
    const match = lotNumber.match(/[\/\\](\d+)/);
    if (match && match[1]) {
      const bags = parseInt(match[1], 10);
      if (!isNaN(bags)) {
        console.log("Extracted bags:", bags);
        form.setValue('bags', bags);
        toast.success(`Automatically set ${bags} bags from lot number`);
      }
    }
  };
  
  return { extractBagsFromLotNumber };
};
