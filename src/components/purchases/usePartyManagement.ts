
import { useState, useCallback } from "react";
import { useEntityData } from "./hooks/useEntityData";
import { useEntityManagement } from "./hooks/useEntityManagement";

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

  // Function to handle party creation from enhanced-select - memoized to prevent recreating on every render
  const handleAddNewSupplier = useCallback((name: string) => {
    setNewPartyName(name);
    setShowAddPartyDialog(true);
    return name; // Just return the name as is for now, it will be replaced when the dialog submits
  }, []);

  // Function to handle transporter creation from enhanced-select - memoized to prevent recreating on every render
  const handleAddNewTransporterFromSelect = useCallback((name: string) => {
    setNewTransporterName(name);
    setShowAddTransporterDialog(true);
    return name; // Just return the name as is for now
  }, []);

  return {
    suppliers,
    transporters,
    agents,
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
