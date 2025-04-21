
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../types/PurchaseTypes";

interface UseBagExtractorProps {
  form: UseFormReturn<PurchaseFormData>;
}

export const useBagExtractor = ({ form }: UseBagExtractorProps) => {
  /**
   * Extracts bag count from lot number if in format Like "DD/12" where 12 is the bag count
   */
  const extractBagsFromLotNumber = (lotNumber: string): number | null => {
    // Look for patterns like "XX/123" where 123 is the bag count
    const match = lotNumber.match(/\/(\d+)$/);
    if (match && match[1]) {
      const bagCount = parseInt(match[1], 10);
      return isNaN(bagCount) ? null : bagCount;
    }
    return null;
  };

  return { extractBagsFromLotNumber };
};
