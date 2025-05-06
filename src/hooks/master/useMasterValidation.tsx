
import { useState } from "react";
import { getSuppliers, getCustomers, getBrokers, getAgents, getTransporters } from "@/services/storageService";
import { MasterType } from "@/types/master.types";

export const useMasterValidation = () => {
  const [nameError, setNameError] = useState<string>("");

  const validateMaster = (name: string, masterType?: MasterType): boolean => {
    // Check if name is provided
    if (!name.trim()) {
      setNameError("Name is required");
      return false;
    }

    // Check if name already exists in the corresponding master list
    const isDuplicate = checkDuplicateName(name, masterType);
    if (isDuplicate) {
      setNameError(`${masterType || 'Item'} with this name already exists`);
      return false;
    }

    setNameError("");
    return true;
  };

  const checkDuplicateName = (name: string, masterType?: MasterType): boolean => {
    const lowercaseName = name.toLowerCase().trim();
    
    // Check in the appropriate master list based on type
    switch (masterType) {
      case "supplier":
      case "party":
        return getSuppliers().some(s => s.name && s.name.toLowerCase() === lowercaseName && !s.isDeleted);
      
      case "customer":
        return getCustomers().some(c => c.name && c.name.toLowerCase() === lowercaseName && !c.isDeleted);
      
      case "broker":
        return getBrokers().some(b => b.name && b.name.toLowerCase() === lowercaseName && !b.isDeleted);
      
      case "agent":
        return getAgents().some(a => a.name && a.name.toLowerCase() === lowercaseName && !a.isDeleted);
      
      case "transporter":
        return getTransporters().some(t => t.name && t.name.toLowerCase() === lowercaseName && !t.isDeleted);
      
      default:
        // Check across all master lists
        const suppliers = getSuppliers().some(s => s.name && s.name.toLowerCase() === lowercaseName && !s.isDeleted);
        const customers = getCustomers().some(c => c.name && c.name.toLowerCase() === lowercaseName && !c.isDeleted);
        const brokers = getBrokers().some(b => b.name && b.name.toLowerCase() === lowercaseName && !b.isDeleted);
        const agents = getAgents().some(a => a.name && a.name.toLowerCase() === lowercaseName && !a.isDeleted);
        const transporters = getTransporters().some(t => t.name && t.name.toLowerCase() === lowercaseName && !t.isDeleted);
        
        return suppliers || customers || brokers || agents || transporters;
    }
  };

  return {
    nameError,
    setNameError,
    validateMaster
  };
};
