
import { useState, useCallback, useMemo } from "react";
import { useEntityData } from "./hooks/useEntityData";
import { useEntityManagement } from "./hooks/useEntityManagement";
import { SelectOption } from "@/components/ui/enhanced-select/types";

export const usePartyManagement = ({ form }) => {
  const { suppliers, transporters, agents, loadData } = useEntityData();

  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);

  const [newPartyName, setNewPartyName] = useState<string>("");
  const [newPartyAddress, setNewPartyAddress] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerAddress, setNewBrokerAddress] = useState<string>("");
  const [newBrokerRate, setNewBrokerRate] = useState<number>(1);
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterAddress, setNewTransporterAddress] = useState<string>("");

  const { 
    handleAddNewParty, 
    handleAddNewBroker, 
    handleAddNewTransporter 
  } = useEntityManagement({
    loadData,
    form,
    setShowAddPartyDialog,
    setShowAddBrokerDialog,
    setShowAddTransporterDialog,
    newPartyName,
    newPartyAddress,
    newBrokerName,
    newBrokerAddress,
    newBrokerRate,
    newTransporterName,
    newTransporterAddress
  });

  // Function to handle party creation from enhanced-select - memoized to prevent re-creation
  const handleAddNewSupplier = useCallback((name: string) => {
    if (!name || typeof name !== 'string') {
      console.error('Invalid supplier name provided:', name);
      return ''; // Return empty string instead of invalid name
    }
    
    setNewPartyName(name);
    setShowAddPartyDialog(true);
    
    // We return a temporary ID that will be replaced when the dialog submits
    return `temp-supplier-${Date.now()}`;
  }, []);

  // Function to handle transporter creation from enhanced-select - memoized to prevent re-creation
  const handleAddNewTransporterFromSelect = useCallback((name: string) => {
    if (!name || typeof name !== 'string') {
      console.error('Invalid transporter name provided:', name);
      return ''; // Return empty string instead of invalid name
    }
    
    setNewTransporterName(name);
    setShowAddTransporterDialog(true);
    
    // We return a temporary ID that will be replaced when the dialog submits
    return `temp-transporter-${Date.now()}`;
  }, []);

  // Memoize the suppliers array to prevent unnecessary re-renders
  const memoizedSuppliers = useMemo(() => {
    return Array.isArray(suppliers) ? suppliers : [];
  }, [suppliers]);

  // Memoize the transporters array to prevent unnecessary re-renders
  const memoizedTransporters = useMemo(() => {
    return Array.isArray(transporters) ? transporters : [];
  }, [transporters]);

  // Memoize the agents array to prevent unnecessary re-renders
  const memoizedAgents = useMemo(() => {
    return Array.isArray(agents) ? agents : [];
  }, [agents]);

  return {
    suppliers: memoizedSuppliers,
    transporters: memoizedTransporters,
    agents: memoizedAgents,
    showAddPartyDialog,
    setShowAddPartyDialog,
    showAddBrokerDialog,
    setShowAddBrokerDialog,
    showAddTransporterDialog,
    setShowAddTransporterDialog,
    newPartyName,
    setNewPartyName,
    newPartyAddress,
    setNewPartyAddress,
    newBrokerName,
    setNewBrokerName,
    newBrokerAddress,
    setNewBrokerAddress,
    newBrokerRate,
    setNewBrokerRate,
    newTransporterName,
    setNewTransporterName,
    newTransporterAddress,
    setNewTransporterAddress,
    handleAddNewParty,
    handleAddNewBroker,
    handleAddNewTransporter,
    handleAddNewSupplier,
    handleAddNewTransporterFromSelect
  };
};
