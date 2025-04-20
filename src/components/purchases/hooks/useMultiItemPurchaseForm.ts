
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Purchase } from "@/services/types";
import { getAgents, getTransporters, getLocations } from "@/services/storageService";
import { usePurchaseForm } from './usePurchaseForm';
import { PurchaseFormState } from '../types/PurchaseFormTypes';

interface UseMultiItemPurchaseFormProps {
  onSubmit: (purchase: Purchase) => void;
  initialValues?: Purchase;
}

export const useMultiItemPurchaseForm = ({ onSubmit, initialValues }: UseMultiItemPurchaseFormProps) => {
  const [agents, setAgents] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);

  const {
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
    updateBrokerageSettings,
    setFormState
  } = usePurchaseForm({ onSubmit, initialValues });

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
    updateBrokerageSettings(type, brokerageRate);
  };

  const handleBrokerageRateChange = (value: number) => {
    updateBrokerageSettings(brokerageType, value);
  };

  return {
    formState: formState as PurchaseFormState,
    isSubmitting,
    brokerageAmount,
    handleSubmit,
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
