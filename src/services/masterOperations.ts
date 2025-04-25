
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Master } from "@/types/master.types";
import { 
  getSuppliers, 
  getCustomers, 
  getBrokers, 
  getTransporters,
  saveStorageItem,
  getMasters
} from "@/services/storageService";

export const addToMasterList = (masterType: string, itemData: { name: string, commissionRate?: number }): string => {
  try {
    if (masterType === "supplier" || masterType === "party") {
      const suppliers = getSuppliers() || [];
      if (suppliers.some((s) => s.name && s.name.toLowerCase() === itemData.name.toLowerCase())) {
        toast.error("Supplier with this name already exists");
        return "";
      }
      
      const newSupplier: Master = {
        id: `supplier-${uuidv4()}`,
        name: itemData.name,
        isDeleted: false,
        type: "supplier"
      };
      
      suppliers.push(newSupplier);
      saveStorageItem('suppliers', suppliers);
      updateMastersList(newSupplier);
      return itemData.name;
    } 
    else if (masterType === "customer") {
      const customers = getCustomers() || [];
      if (customers.some((c) => c.name && c.name.toLowerCase() === itemData.name.toLowerCase())) {
        toast.error("Customer with this name already exists");
        return "";
      }
      
      const newCustomer: Master = {
        id: `customer-${uuidv4()}`,
        name: itemData.name,
        isDeleted: false,
        type: "customer"
      };
      
      customers.push(newCustomer);
      saveStorageItem('customers', customers);
      updateMastersList(newCustomer);
      return itemData.name;
    }
    else if (masterType === "broker") {
      const brokers = getBrokers() || [];
      if (brokers.some((b) => b.name && b.name.toLowerCase() === itemData.name.toLowerCase())) {
        toast.error("Broker with this name already exists");
        return "";
      }
      
      const newBroker: Master = {
        id: `broker-${uuidv4()}`,
        name: itemData.name,
        commissionRate: itemData.commissionRate,
        isDeleted: false,
        type: "broker"
      };
      
      brokers.push(newBroker);
      saveStorageItem('brokers', brokers);
      updateMastersList(newBroker);
      return itemData.name;
    }
    else if (masterType === "transporter") {
      const transporters = getTransporters() || [];
      if (transporters.some((t) => t.name && t.name.toLowerCase() === itemData.name.toLowerCase())) {
        toast.error("Transporter with this name already exists");
        return "";
      }
      
      const newTransporter: Master = {
        id: `transporter-${uuidv4()}`,
        name: itemData.name,
        isDeleted: false,
        type: "transporter"
      };
      
      transporters.push(newTransporter);
      saveStorageItem('transporters', transporters);
      updateMastersList(newTransporter);
      return itemData.name;
    }
    
    toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
    return itemData.name;
  } catch (error) {
    console.error(`Error adding ${masterType}:`, error);
    toast.error(`Failed to add ${masterType}`);
    return "";
  }
};

const updateMastersList = (newMaster: Master) => {
  const masters = getMasters() || [];
  masters.push(newMaster);
  saveStorageItem('masters', masters);
};
