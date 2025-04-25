
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
  getMasters
} from "@/services/storageService";

export const addToMasterList = (masterType: MasterType, itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  try {
    // Handle different master types
    switch (masterType) {
      case "supplier":
      case "party":
        return addSupplier(masterType, itemData);
      
      case "customer":
        return addCustomer(masterType, itemData);
      
      case "broker":
        return addBroker(masterType, itemData);
      
      case "agent":
        return addAgent(masterType, itemData);
      
      case "transporter":
        return addTransporter(masterType, itemData);
      
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

const addSupplier = (masterType: MasterType, itemData: { name: string; type: MasterType }): string => {
  const suppliers = getSuppliers() || [];
  if (suppliers.some((s) => s.name && s.name.toLowerCase() === itemData.name.toLowerCase())) {
    toast.error("Supplier with this name already exists");
    return "";
  }
  
  const newSupplier: Master = {
    id: `supplier-${uuidv4()}`,
    name: itemData.name,
    isDeleted: false,
    type: masterType
  };
  
  suppliers.push(newSupplier);
  saveStorageItem('suppliers', suppliers);
  updateMastersList(newSupplier);
  
  toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
  return itemData.name;
};

const addCustomer = (masterType: MasterType, itemData: { name: string; type: MasterType }): string => {
  const customers = getCustomers() || [];
  if (customers.some((c) => c.name && c.name.toLowerCase() === itemData.name.toLowerCase())) {
    toast.error("Customer with this name already exists");
    return "";
  }
  
  const newCustomer: Master = {
    id: `customer-${uuidv4()}`,
    name: itemData.name,
    isDeleted: false,
    type: masterType
  };
  
  customers.push(newCustomer);
  saveStorageItem('customers', customers);
  updateMastersList(newCustomer);
  
  toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
  return itemData.name;
};

const addBroker = (masterType: MasterType, itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  const brokers = getBrokers() || [];
  if (brokers.some((b) => b.name && b.name.toLowerCase() === itemData.name.toLowerCase())) {
    toast.error("Broker with this name already exists");
    return "";
  }
  
  const newBroker: Master = {
    id: `broker-${uuidv4()}`,
    name: itemData.name,
    commissionRate: itemData.commissionRate || 1,
    isDeleted: false,
    type: masterType
  };
  
  brokers.push(newBroker);
  saveStorageItem('brokers', brokers);
  updateMastersList(newBroker);
  
  toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
  return itemData.name;
};

const addAgent = (masterType: MasterType, itemData: { name: string; commissionRate?: number; type: MasterType }): string => {
  const agents = getAgents() || [];
  if (agents.some((a) => a.name && a.name.toLowerCase() === itemData.name.toLowerCase())) {
    toast.error("Agent with this name already exists");
    return "";
  }
  
  const newAgent: Master = {
    id: `agent-${uuidv4()}`,
    name: itemData.name,
    commissionRate: itemData.commissionRate || 1,
    isDeleted: false,
    type: masterType
  };
  
  agents.push(newAgent);
  saveStorageItem('agents', agents);
  updateMastersList(newAgent);
  
  toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
  return itemData.name;
};

const addTransporter = (masterType: MasterType, itemData: { name: string; type: MasterType }): string => {
  const transporters = getTransporters() || [];
  if (transporters.some((t) => t.name && t.name.toLowerCase() === itemData.name.toLowerCase())) {
    toast.error("Transporter with this name already exists");
    return "";
  }
  
  const newTransporter: Master = {
    id: `transporter-${uuidv4()}`,
    name: itemData.name,
    isDeleted: false,
    type: masterType
  };
  
  transporters.push(newTransporter);
  saveStorageItem('transporters', transporters);
  updateMastersList(newTransporter);
  
  toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
  return itemData.name;
};

const updateMastersList = (newMaster: Master) => {
  const masters = getMasters() || [];
  masters.push(newMaster);
  saveStorageItem('masters', masters);
};

// Export these functions for direct use
export { addSupplier, addCustomer, addBroker, addAgent, addTransporter };
