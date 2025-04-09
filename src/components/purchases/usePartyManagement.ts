
import { useState } from "react";
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

  const checkSimilarPartyNames = (name: string) => {
    if (!name || name.trim().length < 2) return false;

    const normalizedName = name.toLowerCase().trim();
    const allParties = [...getSuppliers(), ...getAgents()];
    
    for (const party of allParties) {
      const partyName = party.name.toLowerCase();
      const similarity = stringSimilarity.compareTwoStrings(normalizedName, partyName);
      
      // Check for high similarity but not exact match
      if (similarity > 0.7 && similarity < 1) {
        setSimilarParty(party);
        setEnteredPartyName(name);
        setShowSimilarPartyDialog(true);
        return true;
      }
    }
    
    return false;
  };

  const handleAddNewParty = () => {
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
  };

  const handleAddNewBroker = () => {
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
  };

  const handleAddNewTransporter = () => {
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
  };

  const useSuggestedParty = () => {
    if (similarParty) {
      form.setValue("party", similarParty.name);
    }
    setShowSimilarPartyDialog(false);
  };

  return {
    showAddPartyDialog,
    setShowAddPartyDialog,
    showAddBrokerDialog,
    setShowAddBrokerDialog,
    showAddTransporterDialog,
    setShowAddTransporterDialog,
    showSimilarPartyDialog,
    setShowSimilarPartyDialog,
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
    useSuggestedParty
  };
};
