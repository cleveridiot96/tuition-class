
import { useCallback } from "react";
import { toast } from "sonner";
import { addCustomer, addBroker, addTransporter } from "@/services/storageService";

interface UseEntityManagementProps {
  loadData: () => void;
  form: any;
  setShowAddPartyDialog: (show: boolean) => void;
  setShowAddBrokerDialog: (show: boolean) => void;
  setShowAddTransporterDialog: (show: boolean) => void;
  newPartyName: string;
  newPartyAddress: string;
  newBrokerName: string;
  newBrokerAddress: string;
  newBrokerRate: number;
  newTransporterName: string;
  newTransporterAddress: string;
}

export const useEntityManagement = ({
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
  newTransporterAddress,
}: UseEntityManagementProps) => {
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
      toast.success("New party added successfully");
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party");
      setShowAddPartyDialog(false);
    }
  }, [newPartyName, newPartyAddress, form, loadData, setShowAddPartyDialog]);

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
      toast.success("New broker added successfully");
    } catch (error) {
      console.error("Error adding new broker:", error);
      toast.error("Failed to add new broker");
      setShowAddBrokerDialog(false);
    }
  }, [newBrokerName, newBrokerAddress, newBrokerRate, form, loadData, setShowAddBrokerDialog]);

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
      toast.success("New transporter added successfully");
    } catch (error) {
      console.error("Error adding new transporter:", error);
      toast.error("Failed to add new transporter");
      setShowAddTransporterDialog(false);
    }
  }, [newTransporterName, newTransporterAddress, form, loadData, setShowAddTransporterDialog]);

  return {
    handleAddNewParty,
    handleAddNewBroker,
    handleAddNewTransporter
  };
};
