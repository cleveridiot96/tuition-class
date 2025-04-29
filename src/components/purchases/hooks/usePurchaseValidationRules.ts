
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { PurchaseFormData } from '../PurchaseFormSchema';
import { getSuppliers, getAgents, getTransporters } from '@/services/storageService';

export const usePurchaseValidationRules = (form: UseFormReturn<PurchaseFormData>) => {
  // Watch form values for validation
  const watchSupplier = form.watch("party");
  const watchAgent = form.watch("agentId");
  const watchBags = form.watch("bags");
  const watchNetWeight = form.watch("netWeight");
  const watchRate = form.watch("rate");

  useEffect(() => {
    // Validate Supplier exists in master
    if (watchSupplier) {
      const suppliers = getSuppliers();
      const supplierExists = suppliers.some(
        s => s.name.toLowerCase() === watchSupplier.toLowerCase() && !s.isDeleted
      );
      
      if (!supplierExists) {
        form.setError('party', {
          type: 'manual',
          message: 'Supplier not found in supplier master'
        });
        toast.error("Selected supplier is not in supplier master");
      } else {
        form.clearErrors('party');
      }
    }
  }, [watchSupplier, form]);

  useEffect(() => {
    // Validate Agent exists in master
    if (watchAgent) {
      const agents = getAgents();
      const agentExists = agents.some(
        a => a.id === watchAgent && !a.isDeleted
      );
      
      if (!agentExists) {
        form.setError('agentId', {
          type: 'manual',
          message: 'Agent not found in agent master'
        });
        toast.error("Selected agent is not in agent master");
      } else {
        form.clearErrors('agentId');
      }
    }
  }, [watchAgent, form]);

  useEffect(() => {
    // Validate Bags and Weight ratio
    if (watchBags && watchNetWeight) {
      const avgWeight = watchNetWeight / watchBags;
      
      // Standard bag weight is usually between 45-55 kg
      if (avgWeight < 45 || avgWeight > 55) {
        toast.warning(`Average bag weight (${avgWeight.toFixed(2)} kg) seems unusual. Please verify.`);
      }
    }
  }, [watchBags, watchNetWeight]);

  useEffect(() => {
    // Validate Rate is within reasonable range
    if (watchRate) {
      // Example: Warn if rate is outside 50-200 range
      if (watchRate < 50 || watchRate > 200) {
        toast.warning("Rate seems unusual. Please verify.");
      }
    }
  }, [watchRate]);

  // Custom validation rules
  const validateSupplier = async (value: string) => {
    if (!value) return true;
    const suppliers = getSuppliers();
    return suppliers.some(s => s.name.toLowerCase() === value.toLowerCase() && !s.isDeleted) || 
      "Supplier must exist in supplier master";
  };

  const validateAgent = async (value: string) => {
    if (!value) return true;
    const agents = getAgents();
    return agents.some(a => a.id === value && !a.isDeleted) || 
      "Agent must exist in agent master";
  };

  const validateTransporter = async (value: string) => {
    if (!value) return true;
    const transporters = getTransporters();
    return transporters.some(t => t.id === value && !t.isDeleted) || 
      "Transporter must exist in transporter master";
  };

  return {
    validateSupplier,
    validateAgent,
    validateTransporter
  };
};
