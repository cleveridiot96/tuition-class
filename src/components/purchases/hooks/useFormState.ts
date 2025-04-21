
import { useState, useCallback } from 'react';
import { Purchase } from '@/services/types';

export interface PurchaseFormState {
  lotNumber: string;
  date: string;
  location: string;
  agentId: string;
  transporterId: string;
  transportCost: string;
  items: { id: any; name: string; quantity: number; rate: number; }[];
  notes: string;
  expenses: number;
  totalAfterExpenses: number;
  brokerageType: string;
  brokerageRate: number;
  bags: number; // Add bags property
}

export const useFormState = (initialValues?: Purchase) => {
  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '0',
    items: initialValues?.items || [{ id: '1', name: '', quantity: 0, rate: 0 }],
    notes: initialValues?.notes || '',
    expenses: initialValues?.expenses || 0,
    totalAfterExpenses: initialValues?.totalAfterExpenses || 0,
    brokerageType: initialValues?.brokerageType || 'percentage',
    brokerageRate: initialValues?.brokerageValue || 1,
    bags: initialValues?.bags || 0, // Initialize bags
  });

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setFormState(prev => {
      if (name === 'expenses' || name === 'brokerageRate') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    formState,
    setFormState,
    handleInputChange,
    handleSelectChange
  };
};
