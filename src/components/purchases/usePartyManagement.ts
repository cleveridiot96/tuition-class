
import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import stringSimilarity from "string-similarity";
import { 
  getSuppliers, 
  getAgents, 
  getBrokers, 
  getTransporters, 
  addCustomer, 
  addBroker, 
  addTransporter 
} from "@/services/storageService";
import { PurchaseFormData } from "./PurchaseFormSchema";

interface UsePartyManagementProps {
  form: UseFormReturn<PurchaseFormData>;
  loadData: () => void;
}

export const usePartyManagement = ({ form, loadData }: UsePartyManagementProps) => {
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [showAddBrokerDialog, setShowAddBrokerDialog] = useState<boolean>(false);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState<boolean>(false);
  const [showSimilarPartyDialog, setShowSimilarPartyDialog] = useState<boolean>(false);
  const [similarParty, setSimilarParty] = useState<any>(null);
  const [enteredPartyName, setEnteredPartyName] = useState<string>("");
  
  const [newPartyName, setNewPartyName] = useState<string>("");
  const [newPartyAddress, setNewPartyAddress] = useState<string>("");
  const [newBrokerName, setNewBrokerName] = useState<string>("");
  const [newBrokerAddress, setNewBrokerAddress] = useState<string>("");
  const [newBrokerRate, setNewBrokerRate] = useState<number>(1);
  const [newTransporterName, setNewTransporterName] = useState<string>("");
  const [newTransporterAddress, setNewTransporterAddress] = useState<string>("");

  // Reset similar party state when dialog is closed
  const resetSimilarPartyState = useCallback(() => {
    setSimilarParty(null);
    setEnteredPartyName("");
    setShowSimilarPartyDialog(false);
  }, []);

  // Safely set the similar party dialog state with defensive coding
  const setSimilarPartyDialogState = useCallback((isOpen: boolean) => {
    try {
      setShowSimilarPartyDialog(isOpen);
      
      // Clean up when dialog is closed
      if (!isOpen) {
        resetSimilarPartyState();
      }
    } catch (error) {
      console.error("Error setting dialog state:", error);
      // Attempt recovery
      setShowSimilarPartyDialog(false);
      resetSimilarPartyState();
    }
  }, [resetSimilarPartyState]);

  const checkSimilarPartyNames = useCallback((name: string) => {
    // Early return with strict type checking
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return false;
    }

    try {
      const normalizedName = name.toLowerCase().trim();
      
      // Get parties with extra safety checks
      const suppliers = Array.isArray(getSuppliers()) ? getSuppliers() : [];
      const agents = Array.isArray(getAgents()) ? getAgents() : [];
      const allParties = [...suppliers, ...agents].filter(Boolean);
      
      // If no parties exist, exit early to avoid issues
      if (allParties.length === 0) {
        return false;
      }
      
      // First reset existing similar party data
      resetSimilarPartyState();
      
      // Then check for similar names with extra safety
      for (const party of allParties) {
        if (!party || !party.name) continue;
        
        const partyName = party.name.toLowerCase();
        const similarity = stringSimilarity.compareTwoStrings(normalizedName, partyName);
        
        // Check for high similarity but not exact match
        if (similarity > 0.7 && similarity < 1) {
          setSimilarParty(party);
          setEnteredPartyName(name);
          
          // Ensure we set the state in a safe manner
          setTimeout(() => {
            setShowSimilarPartyDialog(true);
          }, 0);
          
          return true;
        }
      }
    } catch (error) {
      console.error("Error checking similar party names:", error);
      resetSimilarPartyState();
    }
    
    return false;
  }, [resetSimilarPartyState]);

  const handleAddNewParty = useCallback(() => {
    try {
      if (!newPartyName.trim()) {
        toast.error("Party name is required");
        return;
      }
      
      const newParty = {
        id: `party-${Date.now()}`,
        name: newPartyName.trim(),
        address: newPartyAddress.trim(),
        balance: 0
      };
      
      addCustomer(newParty);
      loadData();
      form.setValue("party", newPartyName.trim());
      setShowAddPartyDialog(false);
      setNewPartyName("");
      setNewPartyAddress("");
      toast.success("New party added successfully");
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party");
    }
  }, [newPartyName, newPartyAddress, form, loadData]);

  const handleAddNewBroker = useCallback(() => {
    try {
      if (!newBrokerName.trim()) {
        toast.error("Broker name is required");
        return;
      }
      
      const newBroker = {
        id: `broker-${Date.now()}`,
        name: newBrokerName.trim(),
        address: newBrokerAddress.trim(),
        commissionRate: newBrokerRate,
        balance: 0
      };
      
      addBroker(newBroker);
      loadData();
      form.setValue("brokerId", newBroker.id);
      setShowAddBrokerDialog(false);
      setNewBrokerName("");
      setNewBrokerAddress("");
      setNewBrokerRate(1);
      toast.success("New broker added successfully");
    } catch (error) {
      console.error("Error adding new broker:", error);
      toast.error("Failed to add new broker");
    }
  }, [newBrokerName, newBrokerAddress, newBrokerRate, form, loadData]);

  const handleAddNewTransporter = useCallback(() => {
    try {
      if (!newTransporterName.trim()) {
        toast.error("Transporter name is required");
        return;
      }
      
      const newTransporter = {
        id: `transporter-${Date.now()}`,
        name: newTransporterName.trim(),
        address: newTransporterAddress.trim(),
        balance: 0
      };
      
      addTransporter(newTransporter);
      loadData();
      form.setValue("transporterId", newTransporter.id);
      setShowAddTransporterDialog(false);
      setNewTransporterName("");
      setNewTransporterAddress("");
      toast.success("New transporter added successfully");
    } catch (error) {
      console.error("Error adding new transporter:", error);
      toast.error("Failed to add new transporter");
    }
  }, [newTransporterName, newTransporterAddress, form, loadData]);

  const useSuggestedParty = useCallback(() => {
    try {
      if (similarParty && similarParty.name) {
        form.setValue("party", similarParty.name);
      }
      
      // Reset state in a controlled manner
      setShowSimilarPartyDialog(false);
      setTimeout(() => {
        resetSimilarPartyState();
      }, 0);
    } catch (error) {
      console.error("Error using suggested party:", error);
      resetSimilarPartyState();
    }
  }, [similarParty, form, resetSimilarPartyState]);

  return {
    showAddPartyDialog,
    setShowAddPartyDialog,
    showAddBrokerDialog,
    setShowAddBrokerDialog,
    showAddTransporterDialog,
    setShowAddTransporterDialog,
    showSimilarPartyDialog,
    setShowSimilarPartyDialog: setSimilarPartyDialogState,
    similarParty,
    enteredPartyName,
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
    checkSimilarPartyNames,
    handleAddNewParty,
    handleAddNewBroker,
    handleAddNewTransporter,
    useSuggestedParty,
    resetSimilarPartyState
  };
};
