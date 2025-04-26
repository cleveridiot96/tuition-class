
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
  const defaultValues = initialValues || {
    lotNumber: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    agentId: '',
    transporterId: '',
    transportCost: '',
    items: [{ id: uuidv4(), name: '', quantity: 0, rate: 0 }],
    notes: '',
    expenses: 0,
    brokerageType: 'percentage',
    brokerageRate: 1,
    bags: 0
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
    // Process form data before submission
    const processedData = {
      ...data,
      expenses: Number(data.expenses || 0),
      totalAmount,
      transportCost,
      brokerageAmount,
      totalAfterExpenses,
      ratePerKgAfterExpenses
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
