
import { useState, useCallback, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Purchase } from '@/services/types';
import { FormMethods, FormUtils, PurchaseFormState } from '../types/PurchaseFormTypes';
import { useFormCalculations } from './useFormCalculations';
import { useEntityData } from './useEntityData';
import { useItemManagement } from './useItemManagement';

export const useMultiItemPurchaseForm = ({ 
  onSubmit, 
  initialValues 
}: { 
  onSubmit: (purchase: Purchase) => void; 
  initialValues?: Purchase 
}) => {
  const currentDate = new Date().toISOString().split('T')[0];

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

  // Track submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Load entity data
  const { agents, transporters, locations, loadData } = useEntityData();
  
  // Handle input changes
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState(prev => {
      if (name === 'expenses' || name === 'brokerageRate') {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  // Handle select changes
  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
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
    const brokerageAmount = formState.brokerageType === 'percentage' ?
      (subtotal * formState.brokerageRate) / 100 :
      formState.brokerageRate;
    return subtotal + parseFloat(formState.transportCost || '0') + formState.expenses + brokerageAmount;
  }, [formState.brokerageRate, formState.brokerageType, calculateSubtotal, formState.expenses, formState.transportCost]);

  // Dialog states
  const [showAddAgentDialog, setShowAddAgentDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const purchaseData: Purchase = {
        id: initialValues?.id || uuidv4(),
        lotNumber: formState.lotNumber,
        date: formState.date,
        location: formState.location,
        agentId: formState.agentId,
        transporterId: formState.transporterId,
        transportCost: parseFloat(formState.transportCost || '0'),
        items: formState.items,
        notes: formState.notes,
        expenses: formState.expenses,
        totalAfterExpenses: calculateTotal(),
        brokerageType: formState.brokerageType,
        brokerageRate: formState.brokerageRate,
        bags: formState.bags,
        party: formState.party,
      };

      onSubmit(purchaseData);
    } catch (error) {
      console.error('Error submitting purchase:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, initialValues, onSubmit, calculateTotal]);

  // Handle entity additions
  const handleAgentAdded = useCallback((agent: any) => {
    loadData();
  }, [loadData]);

  const handleTransporterAdded = useCallback((transporter: any) => {
    loadData();
  }, [loadData]);

  // Handle brokerage changes
  const handleBrokerageTypeChange = useCallback((type: string) => {
    setFormState(prev => ({ ...prev, brokerageType: type }));
  }, []);

  const handleBrokerageRateChange = useCallback((value: number) => {
    setFormState(prev => ({ ...prev, brokerageRate: value }));
  }, []);

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
    handleAgentAdded,
    handleTransporterAdded,
    handleBrokerageTypeChange,
    handleBrokerageRateChange,
  };

  return {
    formState,
    setFormState,
    isSubmitting,
    brokerageAmount,
    handleSubmit,
    formMethods,
    formUtils,
    handleInputChange,
    handleSelectChange,
    handleItemChange,
    handleRemoveItem,
    handleAddItem,
    calculateSubtotal,
    calculateTotal
  };
};
