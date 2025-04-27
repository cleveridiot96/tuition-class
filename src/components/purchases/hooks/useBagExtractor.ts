
import { useCallback } from "react";

interface UseBagExtractorProps {
  form: any;
}

export const useBagExtractor = ({ form }: UseBagExtractorProps) => {
  // Extract bag count from lot number (e.g., "ABC123-10B" -> 10 bags)
  const extractBagsFromLotNumber = useCallback((lotNumber: string): number | null => {
    if (!lotNumber) return null;
    
    // Pattern 1: LOT-10B (extract 10)
    const pattern1 = /-(\d+)B/i;
    const match1 = lotNumber.match(pattern1);
    if (match1 && match1[1]) {
      return parseInt(match1[1], 10);
    }
    
    // Pattern 2: LOT-10 (extract 10)
    const pattern2 = /-(\d+)$/;
    const match2 = lotNumber.match(pattern2);
    if (match2 && match2[1]) {
      return parseInt(match2[1], 10);
    }
    
    // Pattern 3: LOT10 (extract 10 if last characters are digits)
    const pattern3 = /(\d+)$/;
    const match3 = lotNumber.match(pattern3);
    if (match3 && match3[1]) {
      return parseInt(match3[1], 10);
    }
    
    return null;
  }, []);

  return { extractBagsFromLotNumber };
};
