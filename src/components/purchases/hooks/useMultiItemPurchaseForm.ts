
import { useState, useCallback, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Purchase } from '@/services/types';
import { FormMethods, FormUtils, PurchaseFormState } from '../types/PurchaseFormTypes';
import { useFormCalculations } from './useFormCalculations';
import { useEntityData } from './useEntityData';
import { useItemManagement } from './useItemManagement';
import { toast } from 'sonner';

export const useMultiItemPurchaseForm = ({ 
  onSubmit, 
  initialValues 
}: { 
  onSubmit: (purchase: Purchase) => void; 
  initialValues?: Purchase 
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form state with default values or initial values
  const [formState, setFormState] = useState<PurchaseFormState>({
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || currentDate,
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '0',
    items: initialValues?.items ? 
      initialValues.items.map(item => ({ 
        id: item.id || uuidv4(), // Ensure id is always defined
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
    party: initialValues?.party || ''
  });

  // Load entity data
  const { agents, transporters, locations, loadData } = useEntityData();
  
  // Add dialog state
  const [showAddAgentDialog, setShowAddAgentDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  
  // Handle input changes
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle select changes
  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Item management
  const { handleItemChange, handleAddItem, handleRemoveItem } = useItemManagement(setFormState);

  // Calculate subtotal
  const calculateSubtotal = useCallback(() => {
    return formState.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  }, [formState.items]);

  // Calculate total
  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const transportCost = parseFloat(formState.transportCost || '0');
    const brokerageAmount = formState.brokerageType === 'percentage' ?
      (subtotal * formState.brokerageRate) / 100 :
      formState.brokerageRate;
    return subtotal + transportCost + formState.expenses + brokerageAmount;
  }, [formState, calculateSubtotal]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate total quantities and amount
      const totalQuantity = formState.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = calculateSubtotal();
      const weightedAverageRate = totalQuantity > 0 ? totalAmount / totalQuantity : 0;

      const purchaseData: Purchase = {
        id: initialValues?.id || uuidv4(),
        lotNumber: formState.lotNumber,
        date: formState.date,
        location: formState.location,
        agentId: formState.agentId,
        transporterId: formState.transporterId,
        transportCost: parseFloat(formState.transportCost || '0'),
        items: formState.items.map(item => ({
          id: item.id || uuidv4(),
          name: item.name,
          quantity: item.quantity,
          rate: item.rate
        })),
        notes: formState.notes,
        expenses: formState.expenses,
        brokerageType: formState.brokerageType,
        brokerageRate: formState.brokerageRate,
        party: formState.party,
        // Required fields from Purchase type
        netWeight: totalQuantity,
        rate: weightedAverageRate,
        quantity: totalQuantity,
        totalAmount: totalAmount,
        totalAfterExpenses: calculateTotal(),
        bags: formState.items.reduce((sum, item) => sum + Math.ceil(item.quantity / 50), 0) // Assuming 50kg per bag
      };

      await onSubmit(purchaseData);
      toast.success(initialValues ? 'Purchase updated successfully' : 'Purchase added successfully');
    } catch (error) {
      console.error('Error submitting purchase:', error);
      toast.error('Failed to save purchase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate brokerage amount
  const brokerageAmount = formState.brokerageType === 'percentage'
    ? (calculateSubtotal() * formState.brokerageRate) / 100
    : formState.brokerageRate;

  // Form methods for child components
  const formMethods: FormMethods = {
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleRemoveItem,
    handleAddItem,
    calculateSubtotal,
    calculateTotal
  };

  // Form utilities for child components
  const formUtils: FormUtils = {
    agents,
    transporters,
    locations,
    showAddAgentDialog,
    setShowAddAgentDialog,
    showAddTransporterDialog,
    setShowAddTransporterDialog,
    handleAgentAdded: () => loadData(),
    handleTransporterAdded: () => loadData(),
    handleBrokerageTypeChange: (type: string) => {
      setFormState(prev => ({ ...prev, brokerageType: type }));
    },
    handleBrokerageRateChange: (value: number) => {
      setFormState(prev => ({ ...prev, brokerageRate: value }));
    },
  };

  return {
    formState,
    isSubmitting,
    brokerageAmount,
    handleSubmit,
    formMethods,
    formUtils
  };
};
