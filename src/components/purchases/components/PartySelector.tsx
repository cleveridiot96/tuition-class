
import React, { useState, useEffect, useCallback } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSuppliers, addSupplier } from "@/services/storageService";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useAddToMaster } from "@/hooks/useAddToMaster";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";

interface PartySelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const PartySelector: React.FC<PartySelectorProps> = ({ form, partyManagement }) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [newPartyName, setNewPartyName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { confirmAddToMaster } = useAddToMaster();
  
  const loadSuppliers = useCallback(() => {
    const supplierData = getSuppliers() || [];
    const activeSuppliers = supplierData.filter(s => !s.isDeleted);
    setSuppliers(activeSuppliers);
    
    const options = activeSuppliers.map(supplier => ({
      value: supplier.name,
      label: supplier.name
    }));
    
    setSupplierOptions(options);
  }, []);
  
  useEffect(() => {
    loadSuppliers();
  }, []);
  
  useEffect(() => {
    const intervalId = setInterval(loadSuppliers, 1000);
    return () => clearInterval(intervalId);
  }, [loadSuppliers]);
  
  const handleAddNewParty = () => {
    if (!newPartyName.trim()) {
      setErrorMessage("Party name is required");
      return;
    }
    
    if (suppliers.some(s => s.name && s.name.toLowerCase() === newPartyName.trim().toLowerCase())) {
      setErrorMessage("Party with this name already exists");
      return;
    }
    
    const newParty = {
      id: `supplier-${uuidv4()}`,
      name: newPartyName.trim(),
      type: "supplier", 
      isDeleted: false
    };
    
    try {
      addSupplier(newParty);
      loadSuppliers();
      form.setValue("party", newPartyName.trim());
      setShowAddPartyDialog(false);
      toast.success("New party added successfully");
      setNewPartyName("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party. Please try again.");
    }
  };

  const handleAddNewToMaster = (value: string): string => {
    if (!value.trim()) return "";
    
    if (suppliers.some(s => s.name && s.name.toLowerCase() === value.trim().toLowerCase())) {
      toast.error("Party with this name already exists");
      return "";
    }
    
    const newParty = {
      id: `supplier-${uuidv4()}`,
      name: value.trim(),
      type: "supplier",
      isDeleted: false
    };
    
    try {
      addSupplier(newParty);
      loadSuppliers();
      form.setValue("party", value.trim());
      toast.success("New party added successfully");
      return value.trim();
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party. Please try again.");
      return "";
    }
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="party"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Party Name <span className="text-red-500">*</span></FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPartyDialog(true)}
                className="h-6 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            <FormControl>
              <EnhancedSearchableSelect
                options={supplierOptions}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder="Select or enter party name"
                onAddNew={handleAddNewToMaster}
                masterType="supplier"
                emptyMessage="No suppliers found"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPartyName">
                Party Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="newPartyName"
                value={newPartyName}
                onChange={(e) => {
                  setNewPartyName(e.target.value);
                  if (e.target.value.trim()) setErrorMessage("");
                }}
                className={errorMessage ? "border-red-500" : ""}
                placeholder="Enter party name"
                autoComplete="off"
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewParty}>Add Party</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartySelector;
