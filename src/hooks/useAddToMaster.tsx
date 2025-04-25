
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { 
  getSuppliers, 
  getCustomers, 
  getBrokers, 
  getTransporters, 
  addSupplier, 
  addCustomer, 
  addBroker, 
  addTransporter, 
  saveStorageItem,
  getMasters
} from "@/services/storageService";

interface AddToMasterProps {
  masterType?: "supplier" | "customer" | "broker" | "transporter" | "item" | "party";
}

// Extended Master interface with the type property
interface Master {
  id: string;
  name: string;
  isDeleted?: boolean;
  type?: string;
}

export const useAddToMaster = (props?: AddToMasterProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [nameError, setNameError] = useState("");
  const [currentMasterType, setCurrentMasterType] = useState<string>(props?.masterType || "item");
  const [onConfirmCallback, setOnConfirmCallback] = useState<((value: string) => void) | null>(null);

  // Define schema that only requires name
  const commonSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  // Add item to appropriate master list with forced persistence
  const addToMasterList = (masterType: string, itemData: any): string => {
    try {
      if (masterType === "supplier" || masterType === "party") {
        const suppliers = getSuppliers() || [];
        // Check for duplicates
        if (suppliers.some((s) => s.name && s.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Supplier with this name already exists");
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
        
        // Also add to masters list for unified management
        const masters = getMasters() || [];
        masters.push({
          ...newSupplier,
          type: "supplier"
        });
        saveStorageItem('masters', masters);
        
        return itemData.name; // Return the name
      } 
      else if (masterType === "customer") {
        const customers = getCustomers() || [];
        if (customers.some((c) => c.name && c.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Customer with this name already exists");
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
        
        // Also add to masters list for unified management
        const masters = getMasters() || [];
        masters.push({
          ...newCustomer,
          type: "customer"
        });
        saveStorageItem('masters', masters);
        
        return itemData.name; // Return the name
      } 
      else if (masterType === "broker") {
        const brokers = getBrokers() || [];
        if (brokers.some((b) => b.name && b.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Broker with this name already exists");
          toast.error("Broker with this name already exists");
          return "";
        }
        
        const newBroker: Master = {
          id: `broker-${uuidv4()}`,
          name: itemData.name,
          commissionRate: parseFloat(itemData.commissionRate || "1"),
          isDeleted: false,
          type: "broker"
        };
        
        brokers.push(newBroker);
        saveStorageItem('brokers', brokers);
        
        // Also add to masters list for unified management
        const masters = getMasters() || [];
        masters.push({
          ...newBroker,
          type: "broker"
        });
        saveStorageItem('masters', masters);
        
        return itemData.name; // Return the name
      } 
      else if (masterType === "transporter") {
        const transporters = getTransporters() || [];
        if (transporters.some((t) => t.name && t.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Transporter with this name already exists");
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
        
        // Also add to masters list for unified management
        const masters = getMasters() || [];
        masters.push({
          ...newTransporter,
          type: "transporter"
        });
        saveStorageItem('masters', masters);
        
        return itemData.name; // Return the name
      }
      
      toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
      return itemData.name; // Return the name
    } catch (error) {
      console.error(`Error adding ${masterType}:`, error);
      toast.error(`Failed to add ${masterType}`);
      return "";
    }
  };

  // Fix: Make sure handleConfirmAdd properly returns the value
  const handleConfirmAdd = () => {
    try {
      // Reset error state
      setNameError("");
      
      const validation = commonSchema.safeParse({ name: newItemName.trim() });
      
      if (!validation.success) {
        setNameError(validation.error.errors[0].message);
        toast.error(validation.error.errors[0].message);
        return "";
      }
      
      const itemData = {
        name: newItemName.trim()
      };
      
      const addedValue = addToMasterList(currentMasterType, itemData);
      
      if (addedValue && onConfirmCallback) {
        // Return the name as the value (used by searchable dropdowns)
        onConfirmCallback(addedValue);
        
        // Close dialog and reset state
        setIsDialogOpen(false);
        setNewItemName("");
        setNameError("");
      }
      
      return addedValue;
    } catch (error) {
      console.error("Error adding to master:", error);
      toast.error("Error adding item");
      return "";
    }
  };

  // Fix: Ensure confirmAddToMaster properly handles the return value
  const confirmAddToMaster = (itemName: string, onConfirm: (value: string) => void, masterType?: string) => {
    setNewItemName(itemName);
    setOnConfirmCallback(() => onConfirm);
    setNameError("");
    
    if (masterType) {
      setCurrentMasterType(masterType);
    }
    
    setIsDialogOpen(true);
  };
  
  // Dialog component to add to master
  const AddToMasterDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add {currentMasterType}</DialogTitle>
          <DialogDescription>
            Add a new {currentMasterType} to the master list. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="mb-4">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              className={nameError ? "border-red-500" : ""}
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              placeholder={`Enter ${currentMasterType} name`}
            />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>
          
          {currentMasterType === "broker" && (
            <div className="mb-4">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.01"
                placeholder="Enter commission rate"
                defaultValue="1"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAdd}>
            Add {currentMasterType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirmAddToMaster,
    AddToMasterDialog,
  };
};
