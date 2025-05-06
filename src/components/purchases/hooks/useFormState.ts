
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  bags: number;
  party: string; // Added party property to match the interface
}

export const useFormState = (initialValues?: Purchase) => {
  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '0',
    items: initialValues?.items ? 
      initialValues.items.map(item => ({ 
        id: item.id || uuidv4(), 
        name: item.name, 
        quantity: item.quantity, 
        rate: item.rate 
      })) : 
      [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: initialValues?.notes || '',
    expenses: initialValues?.expenses || 0,
    totalAfterExpenses: initialValues?.totalAfterExpenses || 0,
    brokerageType: initialValues?.brokerageType || 'percentage',
    brokerageRate: initialValues?.brokerageRate || 1,
    bags: initialValues?.bags || 0,
    party: initialValues?.party || '', // Initialize party with empty string if not provided
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
