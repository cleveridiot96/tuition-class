
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Master, MasterType } from "@/types/master.types";
import { 
  getSuppliers, 
  getCustomers, 
  getBrokers, 
  getTransporters,
  getAgents,
  saveStorageItem,
  addSupplier as addSupplierToStorage,
  addCustomer as addCustomerToStorage,
  addBroker as addBrokerToStorage,
  addAgent as addAgentToStorage,
  addTransporter as addTransporterToStorage
} from "@/services/storageService";

export const addToMasterList = (masterType: MasterType, itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  try {
    if (!itemData.name || itemData.name.trim() === '') {
      toast.error('Name is required');
      return '';
    }
    
    // Ensure the name doesn't already exist across any master type
    if (isDuplicate(itemData.name, masterType)) {
      toast.error(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} with this name already exists`);
      return '';
    }

    // Handle different master types
    switch (masterType) {
      case "supplier":
      case "party":
        return addSupplier(itemData);
      
      case "customer":
        return addCustomer(itemData);
      
      case "broker":
        return addBroker(itemData);
      
      case "agent":
        return addAgent(itemData);
      
      case "transporter":
        // Add transporters to agents master as requested
        return addTransporterAsAgent(itemData);
      
      default:
        toast.error(`Unknown master type: ${masterType}`);
        return "";
    }
  } catch (error) {
    console.error(`Error adding ${masterType}:`, error);
    toast.error(`Failed to add ${masterType}`);
    return "";
  }
};

// Check if a master with this name already exists in the specific type
const isDuplicate = (name: string, type: MasterType): boolean => {
  const nameLower = name.trim().toLowerCase();
  
  switch (type) {
    case "supplier":
    case "party":
      return getSuppliers().some(s => s.name && s.name.toLowerCase() === nameLower && !s.isDeleted);
    
    case "customer":
      return getCustomers().some(c => c.name && c.name.toLowerCase() === nameLower && !c.isDeleted);
    
    case "broker":
      return getBrokers().some(b => b.name && b.name.toLowerCase() === nameLower && !b.isDeleted);
    
    case "agent":
      return getAgents().some(a => a.name && a.name.toLowerCase() === nameLower && !a.isDeleted);
    
    case "transporter":
      return getTransporters().some(t => t.name && t.name.toLowerCase() === nameLower && !t.isDeleted);
    
    default:
      return false;
  }
};

const addSupplier = (itemData: { name: string; type: MasterType }): string => {
  const newSupplier: Master = {
    id: `supplier-${uuidv4()}`,
    name: itemData.name.trim(),
    isDeleted: false,
    type: "supplier"
  };
  
  addSupplierToStorage(newSupplier);
  toast.success("Supplier added successfully");
  return itemData.name;
};

const addCustomer = (itemData: { name: string; type: MasterType }): string => {
  const newCustomer: Master = {
    id: `customer-${uuidv4()}`,
    name: itemData.name.trim(),
    isDeleted: false,
    type: "customer"
  };
  
  addCustomerToStorage(newCustomer);
  toast.success("Customer added successfully");
  return itemData.name;
};

const addBroker = (itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  const newBroker: Master = {
    id: `broker-${uuidv4()}`,
    name: itemData.name.trim(),
    commissionRate: itemData.commissionRate || 1,
    isDeleted: false,
    type: "broker"
  };
  
  addBrokerToStorage(newBroker);
  toast.success("Broker added successfully");
  return itemData.name;
};

const addAgent = (itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  const newAgent: Master = {
    id: `agent-${uuidv4()}`,
    name: itemData.name.trim(),
    commissionRate: itemData.commissionRate || 1,
    isDeleted: false,
    type: "agent"
  };
  
  addAgentToStorage(newAgent);
  toast.success("Agent added successfully");
  return itemData.name;
};

// Special function to add transporters as agents as specified in requirements
const addTransporterAsAgent = (itemData: { name: string; type: MasterType }): string => {
  // Create an agent record for the transporter
  const newAgent: Master = {
    id: `agent-transporter-${uuidv4()}`,
    name: itemData.name.trim(),
    commissionRate: 0, // No commission for transporters by default
    isDeleted: false,
    type: "agent",
    isTransporter: true // Mark as transporter for reference
  };
  
  // Add to agents collection
  addAgentToStorage(newAgent);
  
  // Also add to transporters collection for backwards compatibility
  const newTransporter: Master = {
    id: newAgent.id, // Use same ID for consistency
    name: itemData.name.trim(),
    isDeleted: false,
    type: "transporter"
  };
  
  addTransporterToStorage(newTransporter);
  
  toast.success("Transporter added successfully");
  return itemData.name;
};

const addTransporter = (itemData: { name: string; type: MasterType }): string => {
  const newTransporter: Master = {
    id: `transporter-${uuidv4()}`,
    name: itemData.name.trim(),
    isDeleted: false,
    type: "transporter"
  };
  
  addTransporterToStorage(newTransporter);
  toast.success("Transporter added successfully");
  return itemData.name;
};

// Export these functions for direct use
export { addSupplier, addCustomer, addBroker, addAgent, addTransporter, addTransporterAsAgent };
