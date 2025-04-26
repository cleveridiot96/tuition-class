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
  party: string;
}

export const useMultiItemPurchaseForm = (initialValues?: Purchase) => {
  const currentDate = new Date().toISOString().split('T')[0];

  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || currentDate,
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
    party: initialValues?.party || '',
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

  const handleItemChange = useCallback((index: number, field: string, value: any) => {
    setFormState(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setFormState(prev => {
      const newItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: newItems };
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 0, rate: 0 }]
    }));
  }, []);

  const calculateSubtotal = useCallback(() => {
    return formState.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  }, [formState.items]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const brokerageAmount = formState.brokerageType === 'percentage' ?
      (subtotal * formState.brokerageRate) / 100 :
      formState.brokerageRate;
    return subtotal + parseFloat(formState.transportCost || '0') + formState.expenses + brokerageAmount;
  }, [formState.brokerageRate, formState.brokerageType, calculateSubtotal, formState.expenses, formState.transportCost]);

  return {
    formState,
    setFormState,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleRemoveItem,
    handleAddItem,
    calculateSubtotal,
    calculateTotal
  };
};
