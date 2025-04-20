import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Purchase } from "@/services/types";
import { PurchaseFormState } from '../../shared/types/PurchaseFormTypes';
import { addPurchase, updatePurchase } from "@/services/storageService";

interface UsePurchaseFormProps {
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

export const usePurchaseForm = ({ onSubmit, initialValues }: UsePurchaseFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokerageAmount, setBrokerageAmount] = useState(0);
  const [brokerageType, setBrokerageType] = useState('percentage');
  const [brokerageRate, setBrokerageRate] = useState(1); // Default 1%

  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '0',
    items: initialValues?.items || [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: initialValues?.notes || '',
    expenses: initialValues?.expenses || 0,
    totalAfterExpenses: initialValues?.totalAfterExpenses || 0
  });

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    if (name === 'lotNumber') {
      // Auto-extract bags from lot number (e.g., DD/12 -> 12 bags)
      const match = value.match(/\/(\d+)/);
      if (match && match[1]) {
        const bags = parseInt(match[1], 10);
        if (!isNaN(bags)) {
          // Update the bags (quantity) for items
          const updatedItems = formState.items.map((item, index) => 
            index === 0 ? { ...item, quantity: bags } : item
          );
          setFormState(prev => ({
            ...prev,
            [name]: value,
            items: updatedItems
          }));
          return;
        }
      }
    }
    
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, [formState.items]);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleItemChange = useCallback((index: number, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const handleAddItem = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: '', quantity: 0, rate: 0 }]
    }));
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  }, []);

  const calculateSubtotal = useCallback(() => {
    return formState.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  }, [formState.items]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    const expenses = parseFloat(formState.expenses?.toString() || '0');
    return subtotal + transportCost + expenses + brokerageAmount;
  }, [formState.transportCost, formState.expenses, calculateSubtotal, brokerageAmount]);

  // Recalculate brokerage whenever subtotal changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    if (brokerageType === 'percentage') {
      setBrokerageAmount(subtotal * (brokerageRate / 100));
    }
  }, [calculateSubtotal, brokerageRate, brokerageType]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const transportCost = parseFloat(formState.transportCost || '0');
      const expenses = parseFloat(formState.expenses?.toString() || '0');
      const totalAmount = calculateTotal();
      const firstItem = formState.items[0] || { quantity: 0, rate: 0 };

      const purchaseData: Purchase = {
        id: initialValues?.id || uuidv4(),
        lotNumber: formState.lotNumber,
        date: formState.date,
        location: formState.location,
        agentId: formState.agentId,
        transporterId: formState.transporterId,
        transportCost: transportCost,
        items: formState.items,
        notes: formState.notes,
        totalAmount: totalAmount,
        expenses: expenses,
        brokerageAmount: brokerageAmount,
        brokerageType: brokerageType,
        totalAfterExpenses: totalAmount,
        quantity: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        netWeight: formState.items.reduce((sum, item) => sum + item.quantity, 0),
        rate: firstItem.rate
      };

      if (initialValues) {
        updatePurchase(purchaseData);
        toast({
          title: "Purchase Updated",
          description: `Purchase ${purchaseData.lotNumber} has been updated.`
        });
      } else {
        addPurchase(purchaseData);
        toast({
          title: "Purchase Added",
          description: `Purchase ${purchaseData.lotNumber} has been added.`
        });
      }

      onSubmit(purchaseData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, initialValues, calculateTotal, onSubmit, toast, brokerageAmount, brokerageType]);

  const updateBrokerageSettings = useCallback((type: string, value: number) => {
    setBrokerageType(type);
    setBrokerageRate(value);
    
    const subtotal = calculateSubtotal();
    if (type === 'percentage') {
      setBrokerageAmount(subtotal * (value / 100));
    } else {
      setBrokerageAmount(value);
    }
  }, [calculateSubtotal]);

  return {
    formState,
    isSubmitting,
    brokerageAmount,
    brokerageType,
    brokerageRate,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    calculateSubtotal,
    calculateTotal,
    handleSubmit,
    updateBrokerageSettings
  };
};
