
import { toast } from "sonner";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { checkDuplicateLot, getPurchases } from '@/services/storageService';

interface ValidationResult {
  isValid: boolean;
  duplicatePurchase?: any;
}

export const usePurchaseValidation = () => {
  
  const validatePurchaseForm = (data: PurchaseFormData, isEdit = false): ValidationResult => {
    // Validate that either Party Name or Agent is filled
    if (!data.party && !data.agentId) {
      toast.error("⚠️ Please enter at least either the Party Name or the Agent before saving.");
      return { isValid: false };
    }
    
    // Check for duplicate lot number if this is a new purchase
    if (!isEdit && checkDuplicateLot(data.lotNumber)) {
      const existingPurchase = getPurchases().find(p => p.lotNumber === data.lotNumber && !p.isDeleted);
      if (existingPurchase) {
        return { isValid: false, duplicatePurchase: existingPurchase };
      }
    }
    
    // All validations passed
    return { isValid: true };
  };
  
  return { validatePurchaseForm };
};
