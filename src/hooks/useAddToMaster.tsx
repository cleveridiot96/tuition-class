
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
import { getSuppliers, getCustomers, getBrokers, getTransporters, addSupplier, addCustomer, addBroker, addTransporter, saveStorageItem } from "@/services/storageService";

interface AddToMasterProps {
  masterType?: "supplier" | "customer" | "broker" | "transporter" | "item";
}

export const useAddToMaster = (props?: AddToMasterProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [additionalFields, setAdditionalFields] = useState<Record<string, string>>({});
  const [currentMasterType, setCurrentMasterType] = useState<string>(props?.masterType || "item");
  const [onConfirmCallback, setOnConfirmCallback] = useState<((value: string) => void) | null>(null);
  const [nameError, setNameError] = useState("");

  // Define schema that only requires name
  const commonSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  // Add item to appropriate master list - ensure proper saving
  const addToMasterList = (masterType: string, itemData: any) => {
    try {
      if (masterType === "supplier" || masterType === "party") {
        const suppliers = getSuppliers() || [];
        // Check for duplicates
        if (suppliers.some((s) => s.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Supplier with this name already exists");
          toast.error("Supplier with this name already exists");
          return false;
        }
        
        const newSupplier = {
          id: `supplier-${uuidv4()}`,
          name: itemData.name,
          address: itemData.address || "",
          contacts: itemData.contacts || [],
          balance: 0,
          isDeleted: false,
        };
        
        suppliers.push(newSupplier);
        saveStorageItem('suppliers', suppliers);
        return true;
      } 
      else if (masterType === "customer") {
        const customers = getCustomers() || [];
        if (customers.some((c) => c.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Customer with this name already exists");
          toast.error("Customer with this name already exists");
          return false;
        }
        
        const newCustomer = {
          id: `customer-${uuidv4()}`,
          name: itemData.name,
          address: itemData.address || "",
          contacts: itemData.contacts || [],
          balance: 0,
          isDeleted: false,
        };
        
        customers.push(newCustomer);
        saveStorageItem('customers', customers);
        return true;
      } 
      else if (masterType === "broker") {
        const brokers = getBrokers() || [];
        if (brokers.some((b) => b.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Broker with this name already exists");
          toast.error("Broker with this name already exists");
          return false;
        }
        
        const newBroker = {
          id: `broker-${uuidv4()}`,
          name: itemData.name,
          commissionRate: parseFloat(itemData.commissionRate || "1"),
          isDeleted: false,
        };
        
        brokers.push(newBroker);
        saveStorageItem('brokers', brokers);
        return true;
      } 
      else if (masterType === "transporter") {
        const transporters = getTransporters() || [];
        if (transporters.some((t) => t.name.toLowerCase() === itemData.name.toLowerCase())) {
          setNameError("Transporter with this name already exists");
          toast.error("Transporter with this name already exists");
          return false;
        }
        
        const newTransporter = {
          id: `transporter-${uuidv4()}`,
          name: itemData.name,
          isDeleted: false,
        };
        
        transporters.push(newTransporter);
        saveStorageItem('transporters', transporters);
        return true;
      }
      
      toast.success(`${masterType.charAt(0).toUpperCase() + masterType.slice(1)} added successfully`);
      return true;
    } catch (error) {
      console.error(`Error adding ${masterType}:`, error);
      toast.error(`Failed to add ${masterType}`);
      return false;
    }
  };

  // Confirm adding item to master
  const handleConfirmAdd = () => {
    try {
      // Reset error state
      setNameError("");
      
      const validation = commonSchema.safeParse({ name: newItemName.trim() });
      
      if (!validation.success) {
        setNameError(validation.error.errors[0].message);
        toast.error(validation.error.errors[0].message);
        return;
      }
      
      const itemData = {
        name: newItemName.trim(),
        ...additionalFields,
      };
      
      const success = addToMasterList(currentMasterType, itemData);
      
      if (success && onConfirmCallback) {
        // Return the name as the value (used by searchable dropdowns)
        onConfirmCallback(newItemName.trim());
        
        // Close dialog and reset state
        setIsDialogOpen(false);
        setNewItemName("");
        setAdditionalFields({});
        setNameError("");
      }
    } catch (error) {
      console.error("Error adding to master:", error);
      toast.error("Error adding item");
    }
  };

  // Open dialog to confirm adding a new item
  const confirmAddToMaster = (itemName: string, onConfirm: (value: string) => void, masterType?: string) => {
    setNewItemName(itemName);
    setOnConfirmCallback(() => onConfirm);
    setNameError("");
    
    if (masterType) {
      setCurrentMasterType(masterType);
    }
    
    setIsDialogOpen(true);
  };

  // Additional fields for different master types
  const getAdditionalFields = () => {
    if (currentMasterType === "broker") {
      return (
        <div className="mb-4">
          <Label htmlFor="commissionRate">Commission Rate (%)</Label>
          <Input
            id="commissionRate"
            type="number"
            step="0.01"
            value={additionalFields.commissionRate || "1"}
            onChange={(e) => setAdditionalFields({ ...additionalFields, commissionRate: e.target.value })}
            placeholder="Enter commission rate"
          />
        </div>
      );
    }
    
    if (currentMasterType === "supplier" || currentMasterType === "customer") {
      return (
        <div className="mb-4">
          <Label htmlFor="address">Address (Optional)</Label>
          <Input
            id="address"
            value={additionalFields.address || ""}
            onChange={(e) => setAdditionalFields({ ...additionalFields, address: e.target.value })}
            placeholder="Enter address"
          />
        </div>
      );
    }
    
    return null;
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
          
          {getAdditionalFields()}
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
