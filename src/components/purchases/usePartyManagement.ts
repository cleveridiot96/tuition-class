
import { useState, useEffect } from "react";
import { getSuppliers, getAgents } from "@/services/storageService";

interface UsePartyManagementProps {
  form: any;
  loadData: () => void;
}

export const usePartyManagement = ({ form, loadData }: UsePartyManagementProps) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  
  // Load party data
  useEffect(() => {
    const loadPartyData = () => {
      try {
        setSuppliers(getSuppliers() || []);
        setAgents(getAgents() || []);
      } catch (error) {
        console.error("Error loading party data:", error);
      }
    };
    
    loadPartyData();
  }, []);
  
  // Add new party
  const addParty = (partyData: any) => {
    try {
      // Implementation depends on addSupplier function
      // This is a placeholder
      console.log("Adding party:", partyData);
      loadData();
    } catch (error) {
      console.error("Error adding party:", error);
    }
  };
  
  // Add new agent
  const addAgent = (agentData: any) => {
    try {
      // Implementation depends on addAgent function
      // This is a placeholder
      console.log("Adding agent:", agentData);
      loadData();
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };
  
  return {
    suppliers,
    agents,
    addParty,
    addAgent
  };
};
