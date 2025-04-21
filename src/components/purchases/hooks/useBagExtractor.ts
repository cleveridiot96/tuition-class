
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";

interface UseBagExtractorProps {
  form: UseFormReturn<PurchaseFormData>;
}

export const useBagExtractor = ({ form }: UseBagExtractorProps) => {
  /**
   * Extracts bag count from a lot number/vakkal string
   * It looks for numbers after a forward slash "/" or backslash "\"
   */
  const extractBagsFromLotNumber = (lotNumber: string): number | null => {
    if (!lotNumber) return null;
    
    // Try to extract bags from the right side of / or \
    const slashMatch = lotNumber.match(/[\/\\](\d+)$/);
    if (slashMatch && slashMatch[1]) {
      const bags = parseInt(slashMatch[1], 10);
      console.log(`Extracted ${bags} bags from lot number: ${lotNumber}`);
      return bags;
    }
    
    return null;
  };
  
  return {
    extractBagsFromLotNumber
  };
};
