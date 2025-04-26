import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { Purchase } from "@/services/types";
import { getAgents, getTransporters, getLocations } from "@/services/storageService";
import { PurchaseFormState } from '../types/PurchaseFormTypes';
import { useFormCalculations } from './useFormCalculations';

interface UseMultiItemPurchaseFormProps {
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

export const useMultiItemPurchaseForm = ({ onSubmit, initialValues }: UseMultiItemPurchaseFormProps) => {
  // Form state with proper initial values
  const defaultValues: Partial<PurchaseFormState> = {
    lotNumber: initialValues?.lotNumber || '',
    date: initialValues?.date || new Date().toISOString().split('T')[0],
    location: initialValues?.location || '',
    agentId: initialValues?.agentId || '',
    transporterId: initialValues?.transporterId || '',
    transportCost: initialValues?.transportCost?.toString() || '',
    items: initialValues?.items?.map(item => ({
      ...item,
      id: item.id || uuidv4() // Ensure every item has an id
    })) || [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: initialValues?.notes || '',
    expenses: initialValues?.expenses || 0,
    brokerageType: initialValues?.brokerageType || 'percentage',
    brokerageRate: initialValues?.brokerageRate || 1,
    bags: initialValues?.bags || 0
  };

  // Form state
  const form = useForm({
    defaultValues
  });

  // Entity data states
  const [agents, setAgents] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);

  // Get form values for calculations
  const formState = form.getValues() as PurchaseFormState;
  
  // Use the calculations hook to compute values based on form state
  const {
    totalAmount,
    transportCost,
    brokerageAmount,
    totalAfterExpenses,
    ratePerKgAfterExpenses,
    calculateSubtotal,
    calculateTotal
  } = useFormCalculations(formState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    try {
      const allAgents = getAgents();
      setAgents(allAgents);

      const allTransporters = getTransporters();
      setTransporters(allTransporters);

      const allLocations = getLocations() || ['Chiplun', 'Mumbai', 'Sawantwadi'];
      setLocations(allLocations);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  // Form event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    form.setValue(name as any, parsedValue);
  };

  const handleSelectChange = (name: string, value: string) => {
    form.setValue(name as any, value);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...form.getValues('items') || []];
    items[index] = { ...items[index], [field]: value };
    form.setValue('items', items);
  };

  const handleRemoveItem = (index: number) => {
    const items = [...form.getValues('items') || []];
    if (items.length > 1) {
      items.splice(index, 1);
      form.setValue('items', items);
    }
  };

  const handleAddItem = () => {
    const items = [...form.getValues('items') || []];
    items.push({ id: uuidv4(), name: '', quantity: 0, rate: 0 });
    form.setValue('items', items);
  };

  const handleAgentAdded = (newAgent: any) => {
    setAgents(prevAgents => [...prevAgents, newAgent]);
    handleSelectChange('agentId', newAgent.id);
    setShowAddAgentDialog(false);
  };

  const handleTransporterAdded = (newTransporter: any) => {
    setTransporters(prevTransporters => [...prevTransporters, newTransporter]);
    handleSelectChange('transporterId', newTransporter.id);
    setShowAddTransporterDialog(false);
  };

  const handleBrokerageTypeChange = (type: string) => {
    form.setValue('brokerageType', type);
  };

  const handleBrokerageRateChange = (value: number) => {
    form.setValue('brokerageRate', value);
  };

  const handleSubmit = form.handleSubmit((data) => {
    // Calculate total quantity/weight from all items
    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate average rate if needed
    const totalValue = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const avgRate = totalQuantity > 0 ? totalValue / totalQuantity : 0;

    // Process form data before submission
    const processedData: Purchase = {
      ...data,
      id: initialValues?.id || Date.now().toString(),
      date: data.date || new Date().toISOString().split('T')[0], // Ensure date is always provided
      expenses: Number(data.expenses || 0),
      transportCost: parseFloat(data.transportCost || '0'),
      totalAmount,
      brokerageAmount,
      totalAfterExpenses,
      ratePerKgAfterExpenses,
      // Add required fields for Purchase type
      party: initialValues?.party || '',
      netWeight: totalQuantity,
      rate: avgRate,
      quantity: totalQuantity,
      // Other required fields from Purchase type
      location: data.location || '',
      bags: data.bags || 0,
      lotNumber: data.lotNumber || ''
    };
    onSubmit(processedData);
  });

  const isSubmitting = form.formState.isSubmitting;

  return {
    formState: formState as PurchaseFormState,
    isSubmitting,
    brokerageAmount,
    handleSubmit,
    form,
    formMethods: {
      handleInputChange,
      handleSelectChange,
      handleItemChange,
      handleRemoveItem,
      handleAddItem,
      calculateSubtotal,
      calculateTotal
    },
    formUtils: {
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
      handleBrokerageRateChange
    }
  };
};
