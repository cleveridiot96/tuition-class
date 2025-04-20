
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useItemManagement = (setFormState: any) => {
  const handleItemChange = useCallback((index: number, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, [setFormState]);

  const handleAddItem = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 0, rate: 0 }]
    }));
  }, [setFormState]);

  const handleRemoveItem = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, [setFormState]);

  return {
    handleItemChange,
    handleAddItem,
    handleRemoveItem
  };
};
