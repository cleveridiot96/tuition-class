
import React, { useState, useEffect } from "react";
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
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [newPartyName, setNewPartyName] = useState<string>("");
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();
  
  useEffect(() => {
    loadSuppliers();
  }, []);
  
  const loadSuppliers = () => {
    const supplierData = getSuppliers() || [];
    setSuppliers(supplierData);
  };
  
  const handleAddNewParty = () => {
    if (!newPartyName.trim()) {
      toast.error("Party name is required");
      return;
    }
    
    const newParty = {
      id: `supplier-${uuidv4()}`,
      name: newPartyName.trim(),
      balance: 0
    };
    
    try {
      addSupplier(newParty);
      loadSuppliers();
      form.setValue("party", newPartyName.trim());
      setShowAddPartyDialog(false);
      toast.success("New party added successfully");
      setNewPartyName("");
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party. Please try again.");
    }
  };

  // Fix: Make sure this function returns the value string as required by EnhancedSearchableSelect
  const handleAddNewToMaster = (value: string): string => {
    if (!value.trim()) return "";
    
    const newParty = {
      id: `supplier-${uuidv4()}`,
      name: value.trim(),
      balance: 0
    };
    
    try {
      addSupplier(newParty);
      loadSuppliers();
      
      // Set the value in the form
      form.setValue("party", value.trim());
      toast.success("New party added successfully");
      
      // Return the value to update the select component
      return value.trim();
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party. Please try again.");
      return "";
    }
  };
  
  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.name,
    label: supplier.name
  }));
  
  return (
    <>
      <FormField
        control={form.control}
        name="party"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
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
                placeholder="Select party"
                onAddNew={handleAddNewToMaster}
                masterType="party"
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
              <Label htmlFor="newPartyName">Party Name <span className="text-red-500">*</span></Label>
              <Input 
                id="newPartyName"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Enter party name"
                autoComplete="off"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewParty}>Add Party</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AddToMasterDialog />
    </>
  );
};

export default PartySelector;
